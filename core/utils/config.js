/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	System configuration. Loads main config and config from 3rd party modules to be used in the system.
 *	Supports multiple environments for the main system config file. TODO: add environment support to
 *	3rd party module config files as well.
 */

var path = require('path');

module.exports = function()
{
	var env = process.env.NODE_ENV || 'production';
	var cfg = require('../../config/' + env + '.json');
	
	// get current home directory for user storage
	cfg.app.storageDir = path.resolve(process.env.HOME + "/formide") || path.resolve(process.env.USERPROFILE + "/formide");

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

		environment: env
	};

	return config;
}
