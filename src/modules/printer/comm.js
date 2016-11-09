'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const crypto = require('crypto');
const path = require('path');
const fork = require('child_process').fork;

/**
 *
 * @param callback
 */
function comm() {
    const driver = fork(path.join(__dirname, 'thread.js'));

    // when client process stops, also kill driver process
    process.on('exit', function () {
        driver.kill();
    });

    // hold callbacks
    var callbacks = {};

    /**
     * Listen to driver events
     * @param callback
     */
    function on(callback) {

        // handle driver process error
        driver.on('error', function (err) {
            return callback(err);
        });

        // handle incoming messages from driver process
        driver.on('message', function (message) {
            if (!message.type)
                callback(new Error('Driver message has incorrect format'));
            else if (message.type === 'started')
                FormideClient.log('formide-drivers started successfully in separate thread');
            else if (message.type === 'error' && message.data)
                FormideClient.log.error('formide-drivers error', message.data);
            else if (message.type === 'event' && message.data)
                callback(null, message.data);
            else if (message.type === 'callback' && message.callbackId) {
                callbacks[message.callbackId].apply(null, [message.err, message.result]);
                delete callbacks[message.callbackId];
            }
        });
    }

    /**
     * Send message and handle callback
     * @param method
     * @param data
     * @param callback
     * @private
     */
    function _sendWithCallback(method, data, callback) {
        const callbackId = crypto.randomBytes(64).toString('hex');
        driver.send({ method, callbackId, data });
        callbacks[callbackId] = callback;

        // wait for callback
        setTimeout(function() {
            if (callbacks[callbackId]) {
                callback(new Error('timeout'));
                delete callbacks[message.callbackId];
            }
        }, 5000);
    }

    /**
     * Send gcode command
     * @param gcodeCommand
     * @param serialPortPath
     * @param callback
     * @returns {*}
     */
    function sendGcode(gcodeCommand, serialPortPath, callback) {
        return _sendWithCallback('sendGcode', [gcodeCommand, serialPortPath], callback);
    }

    /**
     * Send tune command
     * @param gcodeCommand
     * @param serialPortPath
     * @param callback
     * @returns {*}
     */
    function sendTuneGcode(gcodeCommand, serialPortPath, callback) {
        return _sendWithCallback('sendTuneGcode', [gcodeCommand, serialPortPath], callback);
    }

    /**
     * Print a file from disk
     * @param fileName
     * @param printjobId
     * @param serialPortPath
     * @param callback
     */
    function printFile(fileName, printjobId, serialPortPath, callback) {
        return _sendWithCallback('printFile', [fileName, printjobId, serialPortPath], callback);
    }

    /**
     * Get list of all printers
     * @param callback
     */
    function getPrinterList(callback) {
        return _sendWithCallback('getPrinterList', [], callback);
    }

    /**
     * Get printer info by port name
     * @param serialPortPath
     * @param callback
     */
    function getPrinterInfo(serialPortPath, callback) {
        return _sendWithCallback('getPrinterInfo', [serialPortPath], callback);
    }

    /**
     * Pause print
     * @param serialPortPath
     * @param callback
     */
    function pausePrint(serialPortPath, callback) {
        return _sendWithCallback('pausePrint', [serialPortPath], callback);
    }

    /**
     * Resume print
     * @param serialPortPath
     * @param callback
     */
    function resumePrint(serialPortPath, callback) {
        return _sendWithCallback('resumePrint', [serialPortPath], callback);
    }

    /**
     * Stop print
     * @param serialPortPath
     * @param stopGcode
     * @param callback
     */
    function stopPrint(serialPortPath, stopGcode, callback) {
        return _sendWithCallback('stopPrint', [stopGcode, serialPortPath], callback);
    }

    // return functions
    return {
        on,
        sendGcode,
        printFile,
        getPrinterList,
        getPrinterInfo,
        pausePrint,
        resumePrint,
        stopPrint
    }
}

module.exports = comm;