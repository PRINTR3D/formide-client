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
			new (winston.transports.File)({filename: '../logs/printspot.log', level: 'debug' }),
			new winston.transports.Console()
	    ]
	});

	global.Printspot.eventbus.on('internalError', function(error)
	{
		logger.log('debug', error.type, error.data);
		console.log(error.type + ": " + JSON.stringify(error.data)); // temporarily
	});

	global.Printspot.eventbus.on('internalSuccess', function(success)
	{
		logger.log('debug', success.type, success.data);
		console.log(success.type + ": " + JSON.stringify(success.data)); // temporarily
	});

	global.Printspot.eventbus.on('internalMessage', function(message)
	{
		logger.log('debug', message.type, message.data);
		console.log(message.type + ": " + JSON.stringify(message.data)); // temporarily
	});

	return logger;
}