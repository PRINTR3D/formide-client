'use strict';

const assert        = require('assert');
const exec          = require('child_process').exec;
const fs            = require('fs');
const ini           = require('ini');
const path          = require('path');
const request       = require('request');
const semver        = require('semver');
const wifi          = require('./wifi');
const updateBaseURL = 'https://factoryservice.formide.com/update';
const service       = 'sudo fota';

// TODO: fix certs instead of this ugly hack
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// NB: all sudo actions have to be permitted in sudoers.d/formide

module.exports = {

	getCurrentVersion(callback) {
		exec(`${service} current`, (err, stdout, stderr) => {
            if (err || stderr)
                return callback(err || stderr);

			var currentVersion;

			try {
				currentVersion = ini.parse(stdout);
			}
			catch (e) {
				return callback(e);
			}

            return callback(null, {
                version: currentVersion.VERSION,
	            flavour: currentVersion.FLAVOUR,
	            date:    currentVersion.DATE
            });
        });
    },

    getUpdateStatus(callback) {
        exec(`${service} status`, (err, stdout, stderr) => {
            if (err || stderr)
                return callback(err || stderr);

            const updateStatus = ini.parse(stdout);
            if (updateStatus.UPDATE_STATUS === 'success')
                return callback(null, {
                    success: true,
                    timestamp: updateStatus.TIME,
                    message: 'The device was successfully updated'
                });

            return callback(null, {
                success: false,
                timestamp: updateStatus.TIME,
                message: updateStatus.UPDATE_ERR
            });
        });
    },

    checkForUpdate(callback) {
        exec(`${service} current`, (err, stdout, stderr) => {
            if (err || stderr)
                return callback(err || stderr);

	        var currentVersion;

	        try {
		        currentVersion = ini.parse(stdout);
	        }
	        catch(e) {
		        return callback(e);
	        }

	        if (!currentVersion.FLAVOUR || !currentVersion.VERSION)
	            return callback(new Error('There was an issue getting current version information'));

            wifi.mac((err, macAddress) => {
                if (err)
                    return callback(err);

                // get update URL from factory service based on flavour and current version
                // update logic is on server side
                const updateCheckURL = `${updateBaseURL}/${currentVersion.FLAVOUR}/${currentVersion.VERSION}/${macAddress}`;

                request(updateCheckURL, (err, response, body) => {
                    if (err)
                        return callback(err);

                    if (response.statusCode !== 200)
                        return callback(new Error(
                            'There was an issue fetching the latest version from the cloud'));

                    try {
                        body = JSON.parse(body);
                    }
                    catch (e) {
                        return callback(e);
                    }

                    if (body.hasUpdate)
                        return callback(null, {
                            message:    'update found',
                            needsUpdate: true,
                            imageURL:    body.imageURL,
                            signature:   body.signature,
                            version:     body.version,
                            flavour:     body.flavour,
                            published:   body.published
                        });

                    return callback(null, {
                        message:     'There is no update available at this moment',
                        needsUpdate: false
                    });
                });
            });
        });
    },

    update(imageURL, signature, callback) {
        exec(`${service} update ${imageURL} ${signature}`, (err, stdout, stderr) => {
            if (err || stderr)
                return callback(err || stderr);
            return callback(null);
        });
    }
};
