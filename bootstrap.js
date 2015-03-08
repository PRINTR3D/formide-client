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

// require dependencies
var getMac = require('getmac');

// define global objects
FormideOS 	= require('./FormideOS')();
_ 			= require('underscore');

getMac.getMac(function(err, macAddress)
{
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac', macAddress);

	// always include these
	FormideOS.register('device').init();
	FormideOS.register('process').init();
	FormideOS.register('logger').init(FormideOS.config.get('log'));

	// load CLI initiated modules
	if(FormideOS.manager('process').args.setup) // setup mode
	{
		FormideOS.register('dbsetup').init();
	}

	// managers
	FormideOS.register('files').init();
	FormideOS.register('auth').init();
	FormideOS.register('resources').init();
	FormideOS.register('websocket').init();
	FormideOS.register('printer').init(FormideOS.config.get('printer'));
	FormideOS.register('slicer').init(FormideOS.config.get('slicer'));
	FormideOS.register('cloud').init(FormideOS.config.get('cloud'));
	FormideOS.register('interface').init(FormideOS.config.get('dashboard'));
	FormideOS.register('setup').init();
	//FormideOS.register('cron').init();
	//FormideOS.register('led').init();
	//FormideOS.register('camera').init(FormideOS.config.get('camera'));
	//FormideOS.register('wifi').init();
	//FormideOS.register('update').init();
});