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

var events = require('./utils/events.js')();
var config = require('./utils/config.js')();
var debug = require('./utils/debug.js')(config);
var register = require('./utils/register.js');

// define global Printspot object
module.exports = function()
{
	var printspot = {};

	// global object to hold managers
	printspot.managers = {};

	// global config
	printspot.config = config;

	// global events
	printspot.events = events;

	// global debu
	printspot.debug = debug;

	// register manager
	printspot.register = register;

	// get registered manager
	printspot.manager = function(name)
	{
		if(!(name in Printspot.managers))
		{
			Printspot.debug('Manager with name ' + name + ' is not registered', true);
		}
		else
		{
			return printspot.managers[name];
		}
	}

	// return instance of printspot
	return printspot;
};