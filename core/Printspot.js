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

var events = require('events');
var express = require('express');
var callerId = require('caller-id');

// define global Printspot object
module.exports = function(config)
{
	var printspot = {};

	// declare global printspot functions
	printspot.config = config;
	printspot.eventbus = new events.EventEmitter();
	printspot.app = express();
	printspot.server = printspot.app.listen(config.get('app.port'));

	// debug function
	printspot.debug = function(debug)
	{
		if(config.get('app.debug') == true)
		{
			var caller = callerId.getData();
			var callerString = caller.evalOrigin.split('/');
			var consoleString = '[' + callerString[callerString.length - 2] + '/' + callerString[callerString.length - 1] + '] ' + JSON.stringify(debug);

			if(caller.evalOrigin.indexOf('/managers') > -1)
			{
				console.log(consoleString.yellow);
			}
			else
			{
				console.log(consoleString.cyan);
			}
		}
	}

	// register module
	printspot.register = function(name, object)
	{
		printspot.debug('register manager ' + name);
		printspot[name] = object;
	}

	// get registered module
	printspot.get = function(name)
	{
		return printspot[name];
	}

	return printspot;
};