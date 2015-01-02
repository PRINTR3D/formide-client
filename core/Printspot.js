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
var config = require('./utils/config.js')();
var debug = require('./utils/debug.js')(config);

// define global Printspot object
module.exports = function()
{
	var printspot = {};

	// global config
	printspot.config = config;

	// global events
	printspot.eventbus = new events.EventEmitter();

	// global app
	printspot.app = express();

	// global server
	printspot.server = printspot.app.listen(config.get('app.port'));

	// global debu
	printspot.debug = debug;

	// register manager
	printspot.register = function(name, object)
	{
		printspot.debug('register manager ' + name);
		printspot[name] = object;
	}

	// get registered manager
	printspot.manager = function(name)
	{
		return printspot[name];
	}

	// return instance of printspot
	return printspot;
};