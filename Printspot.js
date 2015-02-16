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

var path = require('path');

// define global Printspot object
module.exports = function()
{
	var printspot = {};

	// global app root directory
	printspot.appRoot = path.resolve(__dirname) + '/';

	// global object to hold managers
	printspot.managers = {};

	// global config
	printspot.config = require('./utils/config.js')();

	// global events
	printspot.events = require('./utils/events.js')();

	// global debug
	printspot.debug = require('./utils/debug.js')(printspot.config);

	// global http app
	printspot.http = require('./utils/http.js')(printspot.config);

	// global database
	printspot.db = require('./utils/db.js')(printspot.config, printspot.appRoot);

	// register manager
	printspot.register = require('./utils/register.js');

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