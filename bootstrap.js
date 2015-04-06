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
var getMac 	= require('getmac');

// define global objects
FormideOS 	= require('./FormideOS')();

getMac.getMac(function(err, macAddress)
{
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac', macAddress);

	// core modules
	FormideOS.register('core.http');
	FormideOS.register('core.process');
	FormideOS.register('core.db');
	FormideOS.register('core.auth');
	FormideOS.register('core.websocket');
	FormideOS.register('core.device');

	// app modules
	FormideOS.register('app.log', FormideOS.config.get('log'));
	FormideOS.register('app.webhook');
	FormideOS.register('app.rest');
	FormideOS.register('app.files');
	FormideOS.register('app.printer'/* , FormideOS.config.get('printer') */);
	FormideOS.register('app.slicer', FormideOS.config.get('slicer'));
	FormideOS.register('app.interface', FormideOS.config.get('dashboard'));
	FormideOS.register('app.setup');

	FormideOS.register('app.camera', FormideOS.config.get('camera'));
	FormideOS.register('app.led');

	// under development
	// FormideOS.register('app.cron');
	// FormideOS.register('app.cloud', FormideOS.config.get('cloud'));
	// FormideOS.register('wifi');
	// FormideOS.register('update');
});