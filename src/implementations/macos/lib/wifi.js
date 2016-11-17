'use strict';

/**
 * This module handles Wi-Fi on MacOS. Note: only works on devices that have no ethernet port since we use en0 as primary interface
 */

const exec = require('child_process').exec;

const commands = {
    scan: '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport scan',
    connect: 'networksetup -setairportnetwork {IFACE} {SSID} {PASSWORD}',
    currentNetwork: 'networksetup -getairportnetwork {IFACE}',
    ip: 'ipconfig getifaddr {IFACE}',
    mac: 'networksetup -getmacaddress Wi-Fi'
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
        var lines = str.split('\n');
        var wifis = {};

        for (var i = 1, l = lines.length; i < l; i++) {
            var mac = lines[i].match(scanRegex);
            if (!mac) {
                continue;
            }
            var macStart = lines[i].indexOf(mac[0]);
            var ssid = lines[i].substr(0, macStart).trim();

            wifis[ssid] = { ssid };
        }
    }
    catch (ex) {
        err = ex;
    }

    return callback(err, wifis);
}

/**
 * Get MAC address from full terminal command response
 * @param input
 */
function parseMacAddress(input) {
    return input.split(' ')[2];
}

/**
 * Execute command line argument
 * @param cmd
 */
function execute(cmd, callback) {
    exec(cmd, function(err, stdout, stderr) {
        if (err || stderr) return callback(err || stderr)
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
     * Since this feature is difficult to implement in MacOS, we act like we are always connected
     * @param callback
     */
    status(callback) {
        return callback(null, 'connected,configured');
    },

    /**
     * Get current network
     * @param callback
     */
    network(callback) {
        execute(commands.currentNetwork.replace('{IFACE}', iface), function (err, network) {
            if (err) return callback(err);
            return callback(null, network);
        });
    },

    /**
     * Get IP address
     * @param callback
     */
    ip(callback) {
        execute(commands.ip.replace('{IFACE}', iface), function (err, ip) {
            if (err) return callback(err);
            return callback(null, ip);
        });
    },

    /**
     * Get MAC address
     * @param callback
     */
    mac(callback) {
        execute(commands.mac.replace('{IFACE}', iface), function (err, mac) {
            if (err) return callback(err);
            return callback(null, parseMacAddress(mac));
        });
    },

    /**
     * Connect to a nearby network
     * @param ssid
     * @param password
     * @param callback
     */
    connect(config, callback) {
        if (!config.ssid)
            return callback(new Error('SSID not found in config'));
        if (!config.password)
            return callback(new Error('Password not found in config'));

        execute(commands.connect.replace('{IFACE}', iface).replace('{SSID}', config.ssid).replace('{PASSWORD}', config.password), function (err, status) {
            if (err) return callback(err);
            return callback(null, status);
        });
    },

    /**
     * reset Wi-Fi
     * Since MacOS can't really reset all Wi-Fi (and you don't want to), we always return a success message
     * @param callback
     */
    reset(callback) {
        return callback(null, { message: "Successfully reset Wi-Fi" });
    }
}