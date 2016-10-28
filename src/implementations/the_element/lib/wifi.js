'use strict';

const exec       = require('child_process').exec;
const bashEscape = require('./../bashutils').escape;
const service    = 'sudo fiw';

// NB: all sudo actions have to be permitted in sudoers.d/formide

module.exports = {
    list(callback) {
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

    status(callback) {
        exec(`${service} wlan0 status`, (err, stdout) => {
            if (err)
                return callback(err);

            const isConnected = stdout.trim() == 'connected,configured';
            return callback(null, isConnected);
        });
    },

    network(callback) {
        exec(`${service} wlan0 network`, (err, stdout) => {
            if (err)
                return callback(err);

            const network = stdout.trim();
            return callback(null, network);
        });
    },

    ip(callback) {
        exec(`${service} wlan0 ip`, (err, stdout) => {
            if (err)
                return callback(err);

            const ip = stdout.trim();
            return callback(null, ip);
        });
    },

    mac(callback) {
        exec(`${service} wlan0 mac`, (err, stdout) => {
            if (err)
                return callback(err);

            const mac = stdout.trim();
            return callback(null, mac);
        });
    },

    connectToNetwork(essid, password, callback) {
        if (essid == null || essid.length === 0 || essid.length > 32)
            return callback(new Error('essid must be 1..32 characters'));

        if (password.length !== 0 && (password.length < 8 || password.length > 63))
            return callback(new Error('password must be 8..63 characters, or 0 characters for an unprotected network'));

        const _essid    = bashEscape(essid);
        const _password = bashEscape(password);

        var connectCommand = `${service} wlan0 connect ${_essid} ${_password}`;
        connectCommand = connectCommand.trim();

        exec(connectCommand,
            (err, stdout) => {
                if (err)
                    return callback(new Error(
                        `Failed to connect to ${essid}`));

                const ok = stdout.trim() == 'OK';
                if (ok)
                    return callback(null, {
                        message: "Successfully connected to " + essid
                    });
                return callback(new Error(`Failed to connect to ${essid}`));
            });
    },

    reset(callback) {
        exec(`${service} wlan0 reset`, (err, stdout) => {
            if (err)
                return callback(err);

            return callback(null, { message: "Successfully reset wlan0" });
        });
    }
};
