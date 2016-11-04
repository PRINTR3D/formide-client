'use strict';

/**
 * This module handles Wi-Fi on MacOS. Note: only works on devices that have no ethernet port since we use en0 as primary interface
 */

const exec = require('child_process').exec;

const commands = {
    on: 'networksetup -setairportpower {IFACE} on',
    off: 'networksetup -setairportpower {IFACE} off',
    scan: '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport scan',
    connect: 'networksetup -setairportnetwork {IFACE} {SSID} {PASSWORD}',
    currentNetwork: 'networksetup -getairportnetwork {IFACE}',
    ip: 'ipconfig getifaddr {IFACE}',
    mac: ''
};
const scanRegex = /([0-9a-zA-Z]{1}[0-9a-zA-Z]{1}[:]{1}){5}[0-9a-zA-Z]{1}[0-9a-zA-Z]{1}/;
const iface = 'en0';

/**
 * Parse network scan output
 * Borrowed from https://github.com/ancasicolica/node-wifi-scanner
 * @param str
 * @param callback
 */
function parseOutput(str, callback) {
    var err = null;

    try {
        var lines      = str.split('\n');
        var wifis = [];

        for (var i = 1, l = lines.length; i < l; i++) {
            var mac = lines[i].match(scanRegex);
            if (!mac) {
                continue;
            }
            var macStart = lines[i].indexOf(mac[0]);
            var elements = lines[i].substr(macStart).split(/[ ]+/);
            wifis.push({
                'ssid'    : lines[i].substr(0, macStart).trim(),
                'mac'     : elements[0].trim(),
                'channel' : parseInt(elements[2].trim(), 10),
                'rssi'    : parseInt(elements[1].trim())
            });
        }
    }
    catch (ex) {
        err = ex;
    }

    callback(err, wifis);
}

/**
 * Execute command line argument
 * @param cmd
 */
function execute(cmd, callback) {
    exec(cmd, function(err, stdout, stderr) {
        if (err || stderr)
            return callback(err || stderr)
        return callback(null, stdout.trim());
    });
}

/**
 * Module
 */
module.exports = {

    /**
     * List nearby networks
     * @param callback
     */
    list(callback) {
        execute(commands.scan, function (err, networks) {
            if (err) return callback(err);
            parseOutput(networks, function(err, list) {
                if (err) return callback(err);
                return callback(null, list);
            });
        });
    },

    /**
     * Get Wi-Fi status
     * @param callback
     */
    status(callback) {

    },

    /**
     * Get current network
     * @param callback
     */
    network(callback) {
        execute(commands.currentNetwork.replace('{IFACE}', 'en0'), function (err, network) {
            if (err)
                return callback(err);
            return callback(null, network);
        });
    },

    ip() {

    },

    mac() {

    },

    connect() {

    },

    reset() {

    }
}