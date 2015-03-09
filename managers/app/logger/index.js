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
	logger: {},

	init: function(config)
	{
		this.logger = new(winston.Logger)({
			transports:
		    [
				new (winston.transports.File)({filename: FormideOS.appRoot + config.path + '/FormideOS.log', level: 'debug' })
		    ]
		});

		FormideOS.manager('events').on('log.error', this.logError);
		FormideOS.manager('events').on('log.success', this.logSuccess);
		FormideOS.manager('events').on('log.message', this.logMessage);
	},

	logError: function(error)
	{
		this.logger.log('debug', error.type, error.data);
	},

	logSuccess: function(success)
	{
		this.logger.log('debug', success.type, success.data);
	},

	logMessage: function(message)
	{
		this.logger.log('debug', message.type, message.data);
	}
}