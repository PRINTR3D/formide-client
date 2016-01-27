/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	System configuration. Loads main config and config from 3rd party modules to be used in the system.
 *	Supports multiple environments for the main system config file. TODO: add environment support to
 *	3rd party module config files as well.
 */

const path   = require('path');
const getMac = require('getmac');
const Sync   = require('sync');
var macAddress, versions;

function getUserHome() {
    if (process.platform === 'win32') return process.env.USERPROFILE;
    return process.env.HOME;
}

module.exports = function() {

    getVersions();

	const env = process.env.NODE_ENV || 'production';
	var cfg = require('../../config/' + env + '.json');

    // get mac address
    Sync(function() {
        macAddress = getMac.getMac.sync();
    }, function (err) {
        if (err) console.error(err);
    });

    // get versions
    getVersions();

	// get current home directory for user storage
	cfg.app.storageDir = path.join(getUserHome(), 'formide');

	function parts(key) {
		if (Array.isArray(key)) return key
		return key.split('.')
	}

	var config = {

		get: function(key) {
			var obj = cfg;
			key = parts(key);
			for (var i = 0, l = key.length; i < l; i++)
			{
				var part = key[i];
				if( !(part in obj) )
				{
					return null;
				}
				obj = obj[part];
  			}
  			return obj;
		},

		set: function(key, value) {
			cfg[key] = value;
			return this;
		},

		environment: env,

        getVersions: function() {
            return versions;
        },

        getMacAddress: function() {
            return macAddress
        }
	};

	return config;
}

function getVersions() {
    var elementToolsVersion, rootfsVersion;

    try {
        const elementTools = require('element-tools');

        Sync(function() {
            rootfsVersion = elementTools.getCurrentVersion.sync();
        }, function (err) {
            if (err) console.error(err);
        });

        elementToolsVersion = require('element-tools/package.json').version;

        versions = {
            'formide-client': require('../../package.json').version,
            'formide-tools': require('formide-tools/package.json').version,
            'formide-client-interface': require('formide-client-interface/package.json').version,
            'element-tools': elementToolsVersion,
            'rootfs': rootfsVersion
        };
    }
    catch (e) {
        console.error(e);
        // elementToolsVersion = false;
        // rootfsVersion = false;
    }
}
