/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const fs            = require('fs');
const path          = require('path');
const request       = require('request');
const exec          = require('child_process').exec;
const ini           = require('ini');
const downloadRoot  = 'http://downloads.formide.com/releases/'
const assert        = require('assert');

module.exports = {

    updateScriptLocation: null,
    newVersionLocation: null,
    currentVersionLocation: null,
    channel: null,

	init: function(config) {
        this.updateScriptLocation = config.updateScriptLocation;
        this.newVersionLocation = config.newVersionLocation;
        this.currentVersionLocation = config.currentVersionLocation;
        this.channel = config.channel;

        this.checkForUpdate(function(err, response) {
            if (err) return FormideOS.log.error('Checking for update', err);
            return FormideOS.log.debug(response);
        });
	},

    getUpdateStatus: function(callback) {
        if (process.env.UPDATE_STATUS === 'success') {
            return callback(null, {
                success: true,
                message: 'The device has successfully updated during the latest reboot'
            });
        }
        else {
            return callback(new Error(process.env.UPDATE_ERR));
        }
    },

    checkForUpdate: function(callback) {
        var currentVersion = ini.parse(fs.readFileSync(this.currentVersionLocation, 'utf-8'));
        request(
            FormideOS.config.get('cloud.url') + '/products/client/latest/' + this.channel,
            function(err, response, body) {
                if (err) return callback(err);
                if (response.statusCode !== 200) return callback(new Error('Not 200'));

                if (body.releaseNumber > currentVersion.RELEASE) {
                    assert(body.releaseNumber);
                    assert(body.version);
                    assert(body.url);
                    assert(body.signature);

                    var newVersionFile = ini.stringify({
                        RELEASE:        body.releaseNumber,
                        VERSION:        body.version,
                        IMAGE_LOCATION: downloadRoot + body.url,
                        SIGNATURE:      body.signature
                    });

                    body.message = 'update found');

                    fs.writeFileSync(this.newVersionLocation, newVersionFile);
                    return callback(null, body);
                }
                else {
                    return callback(null, { message: 'no update found' });
                }
            }
        );
    },

    doUpdate: function(callback) {
        // yup, that's all there is to it :P
        exec(this.updateScriptLocation, function(error, stdout, stderr) {
            if (err) return callback(err);
            return callback(null);
        });
    }
}
