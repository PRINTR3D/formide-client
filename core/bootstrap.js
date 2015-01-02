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

// define global Printspot object
Printspot = require('./Printspot')();

getMac.getMac(function(err, macAddress)
{
	Printspot.macAddress = Printspot.config.get('cloud.softMac', macAddress);

	// require mandatory modules, do not change this part!
	require('./managers/logger');
	require('./managers/database');

	// require other modules
	require('./managers/slicer');
	require('./managers/printer');
	require('./managers/cloud');
	require('./managers/dashboard');
	require('./managers/api');
	//require('./managers/camera');
	//require('./managers/wifi');
});