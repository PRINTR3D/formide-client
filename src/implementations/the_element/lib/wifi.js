'use strict';

const fs         = require('fs');
const exec       = require('child_process').exec;
const bashEscape = require('../bashUtils').escape;
const service    = 'sudo fiw'; // NB: all sudo actions have to be permitted in sudoers.d/formide

/**
 * Filter list of networks to only return valid essids
 * @param stdout
 * @returns {{}}
 */
function getSsids(stdout) {
    const essids = stdout.split('\n').filter(a => a);
    let result = {};

    for (const essid of essids) {
        // HACK: NAT-160: removing weird entries
        if (essid.startsWith('\\x'))
            continue;

        // HACK: NAT-124: removing weird ping
        if (essid.startsWith('PING '))
            break;

        result[essid] = { ssid: essid };
    }

    return result;
}

module.exports = {

    /**
     * Get a list of nearby Wi-Fi networks
     * @param callback
     */
    list(callback) {
        exec(`${service} wlan0 cached-scan`, (err, stdout) => {
            if (err || !stdout)
                return exec('sudo fiw wlan0 scan', (err, stdout) => {
                    if (err)
                        return callback(err);

                    const result = getSsids(stdout);
                    return callback(null, result);
                });

            const result = getSsids(stdout);
            return callback(null, result);
        });
    },

    /**
     * Get current Wi-Fi status from fiw service
     * @param callback
     */
    status(callback) {
        exec(`${service} wlan0 status`, (err, stdout) => {
            if (err)
                return callback(err);

            const isConnected = stdout.trim() == 'connected,configured';
            return callback(null, isConnected);
        });
    },

    /**
     * Get name of network currently connected to
     * @param callback
     */
    network(callback) {
        exec(`${service} wlan0 network`, (err, stdout) => {
            if (err)
                return callback(err);

            const network = stdout.trim();
            return callback(null, network);
        });
    },

    /**
     * Get IP address
     * @param callback
     */
    ip(callback) {
        exec(`${service} wlan0 ip`, (err, stdout) => {
            if (err)
                return callback(err);

            const ip = stdout.trim();
            return callback(null, ip);
        });
    },

    /**
     * Get MAC address
     * @param callback
     */
    mac(callback) {
        exec(`${service} wlan0 mac`, (err, stdout) => {
            if (err)
                return callback(err);

            const mac = stdout.trim();
            return callback(null, mac);
        });
    },

    /**
     * Connect to a network by essid/password combo
     * @param essid
     * @param password
     * @param customConfig
     * @param callback
     * @returns {*}
     */
    connect(config, callback) {

        // filter out fields that wpa_supplicant cannot handle
        const allowedFields = ['ssid', 'password', 'key_mgmt', 'eap', 'identity', 'anonymous_identity', 'phase1', 'phase2'];
        for (var field in config)
            if (allowedFields.indexOf(field) < 0)
                delete config[field];

        // choose connection type
        if (Object.keys(config).length === 2)
            connectSimple(config.ssid, config.password, callback);
        else
            connectAdvanced(config, callback);
    },

    /**
     * Reset Wi-Fi and fall back to hot-spot mode
     * @param callback
     */
    reset(callback) {
        exec(`${service} wlan0 reset`, (err, stdout) => {
            if (err)
                return callback(err);

            return callback(null, { message: "Successfully reset wlan0" });
        });
    }
};

/**
 * Connect using SSID and password
 * @param essid
 * @param password
 * @param callback
 * @returns {*}
 */
function connectSimple(essid, password, callback) {
    if (essid == null || essid.length === 0 || essid.length > 32)
        return callback(new Error('essid must be 1..32 characters'));

    if (password.length !== 0 && (password.length < 8 || password.length > 63))
        return callback(new Error('password must be 8..63 characters, or 0 characters for an unprotected network'));

    const _essid    = bashEscape(essid);
    const _password = bashEscape(password);

    var connectCommand = `${service} wlan0 connect ${_essid} ${_password}`;
    connectCommand = connectCommand.trim();

    exec(connectCommand, function (err, stdout, stderr) {
        if (err || stderr)
            return callback(new Error(`Failed to connect to ${essid}`));

        if (stdout.trim() !== 'OK')
            return callback(new Error(`Failed to connect with custom config`));

        return callback(null, { message: `Successfully connected to ${essid}` });
    });
}

/**
 * Connect using advanced wpa_supplicant configuration
 * @param config
 * @param callback
 */
function connectAdvanced(config, callback) {

    // build wpa_supplicant config
    var wpa_supplicant = '';
    for (var param in config) {
        var wpa_supplicant_command = bashEscape(`${param}="${config[param]}"`);
        wpa_supplicant += wpa_supplicant_command + " ";
    }

    // execute reconnect of fiw service, now using updated config
    exec(`${service} wlan0 connectWithConfig ${wpa_supplicant}`, (err, stdout, stderr) => {
        if (err || stderr)
            return callback(new Error(`Failed to connect to ${config.ssid}`));

        if (stdout.trim() !== 'OK')
            return callback(new Error(`Failed to connect with custom config`));

        return callback(null, { message: "Successfully connected with custom config" });
    });
}