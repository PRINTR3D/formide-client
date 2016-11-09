'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const path = require('path');
const fork = require('child_process').fork;

/**
 *
 * @param callback
 */
function comm() {
    const driver = fork(path.join(FormideClient.appRoot, 'node_modules', 'formide-drivers', 'thread.js'));

    var callbacks = [];

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

            if (!message.type || !message.data)
                return callback(new Error('Driver message has incorrect format'));

            if (message.type === 'started')
                FormideClient.log('formide-drivers started successfully in separate thread');

            else if (message.type === 'error')
                FormideClient.log.error('formide-drivers error', message.data);

            else if (message.type === 'event')
                return callback(null, message.data);
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
        const callbackId =  1;//callbacks.push(callback);
        driver.send({ method, callbackId, data });

        // wait for callback
        setTimeout(function() {
            return callback(new Error('timeout'));
        });

        // listen for incoming callback message
        driver.on('message', function (message) {
            if (message.type && message.type === 'callback')
                if (message.callbackId === callbackId)
                    return callback(null, message.data); // TODO: handle error?
        });
    }

    /**
     * Send gcode command
     * @param gcodeCommand
     * @param serialPortPath
     * @param callback
     * @returns {*}
     */
    function sendGcode(gcodeCommand, serialPortPath, callback) {
        return _sendWithCallback('sendGcode', { gcodeCommand, serialPortPath }, callback);
    }

    /**
     * Send tune command
     * @param gcodeCommand
     * @param serialPortPath
     * @param callback
     * @returns {*}
     */
    function sendTuneGcode(gcodeCommand, serialPortPath, callback) {
        return _sendWithCallback('sendTuneGcode', { gcodeCommand, serialPortPath }, callback);
    }

    /**
     * Print a file from disk
     * @param fileName
     * @param printjobId
     * @param serialPortPath
     * @param callback
     */
    function printFile(fileName, printjobId, serialPortPath, callback) {

    }

    /**
     * Get list of all printers
     * @param callback
     */
    function getPrinterList(callback) {

    }

    /**
     * Get printer info by port name
     * @param serialPortPath
     * @param callback
     */
    function getPrinterInfo(serialPortPath, callback) {

    }

    /**
     * Pause print
     * @param serialPortPath
     * @param callback
     */
    function pausePrint(serialPortPath, callback) {

    }

    /**
     * Resume print
     * @param serialPortPath
     * @param callback
     */
    function resumePrint(serialPortPath, callback) {

    }

    /**
     * Stop print
     * @param serialPortPath
     * @param stopGcode
     * @param callback
     */
    function stopPrint(serialPortPath, stopGcode, callback) {

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