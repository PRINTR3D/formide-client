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
var events = require('events');
var getMac = require('getmac');
var express = require('express');

// define global Printspot object
global.Printspot = {};

// register global objects
global.Printspot.eventbus = new events.EventEmitter();
global.Printspot.register = require('./utils/register.js');
global.Printspot.config = require('./utils/config.js')();
global.Printspot.app = express();
global.Printspot.server = global.Printspot.app.listen(global.Printspot.config.get('app.port'));

getMac.getMac(function(err, macAddress)
{
	global.Printspot.macAddress = global.Printspot.config.get('cloud.softMac', macAddress);

	// require mandatory modules
	require('./managers/logger/register.js');
	require('./managers/database/register.js');

	// require communication modules
	require('./managers/slicer/register.js');
	require('./managers/printer/register.js');
	require('./managers/cloud/register.js');
	require('./managers/dashboard/register.js');

	// require api
	require('./api/register.js');
});