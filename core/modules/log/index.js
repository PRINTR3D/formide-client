/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
 */

var winston = require('winston');

module.exports =
{
	name: "log",
	
	logger: {},

	init: function(config)
	{
		this.logger = new(winston.Logger)({
			transports:
		    [
				new (winston.transports.File)({
					filename: FormideOS.appRoot + config.path + '/FormideOS.log',
					level: 'debug'
				})
		    ]
		});

		FormideOS.manager('events').on('log.debug', this.logDebug.bind(this));
		FormideOS.manager('events').on('log.error', this.logError.bind(this));
		FormideOS.manager('events').on('log.info', this.logInfo.bind(this));
	},

	get: function(options, callback) {
		this.logger.query(options, function(err, results) {
			return callback(results);
		});
	},

	logDebug: function(debug)
	{
		this.logger.log('debug', debug.message, debug.data);
	},

	logError: function(error)
	{
		this.logger.log('error', error.message, error.data);
	},

	logInfo: function(info)
	{
		this.logger.log('info', info.message, info.data);
	}
}