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
var argv = require('minimist')(process.argv.slice(2));

// define global Printspot object
Printspot = require('./Printspot')();

getMac.getMac(function(err, macAddress)
{
	Printspot.macAddress = Printspot.config.get('cloud.softMac', macAddress);
	Printspot.args = argv;

	// always include these
	Printspot.register('logger').init();
	Printspot.register('database').init(Printspot.config.get('database'));

	if(Printspot.args.setup) // setup mode
	{
		Printspot.register('setup').init();
	}
	if(Printspot.args.driver) // simulated driver mode
	{
		Printspot.register('simdriver').init();
	}
	if(Printspot.args.slicer) // simulated slicer mode
	{
		Printspot.register('simslicer').init();
	}

	// server & http
	Printspot.register('app').init();
	Printspot.register('http').init(Printspot.config.get('app'));
	Printspot.register('api').init();

	// real time modules
	Printspot.register('printer').init(Printspot.config.get('printer'));
	Printspot.register('slicer').init(Printspot.config.get('slicer'));
	Printspot.register('cloud').init(Printspot.config.get('cloud'));
	Printspot.register('websocket').init();
	Printspot.register('interface').init();

	// other modules
	// Printspot.register('update').init();
});