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

// define global Printspot object
module.exports = function(config)
{
	var printspot = {};

	printspot.config = config;
	printspot.eventbus = new events.EventEmitter();
	printspot.app = express();
	printspot.server = printspot.app.listen(config.get('app.port'));

	printspot.register = function(name, object)
	{
		printspot[name] = object;
	}

	printspot.get = function(name)
	{
		return printspot[name];
	}

	return printspot;
};