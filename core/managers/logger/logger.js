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

module.exports = function()
{
	var logger = {};

	logger = new(winston.Logger)({
		transports:
	    [
			new (winston.transports.File)({filename: '../logs/printspot.log', level: 'debug' })
	    ]
	});

	Printspot.eventbus.on('internalError', function(error)
	{
		logger.log('debug', error.type, error.data);
	});

	Printspot.eventbus.on('internalSuccess', function(success)
	{
		logger.log('debug', success.type, success.data);
	});

	Printspot.eventbus.on('internalMessage', function(message)
	{
		logger.log('debug', message.type, message.data);
	});

	function formatDate(date)
	{
		return date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
	}

	return logger;
}