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

getMac.getMac(function(err, macAddress) {
	
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac') || macAddress;

	// core modules
	FormideOS.register('core.http');
	FormideOS.register('core.process');
	FormideOS.register('core.db');
	FormideOS.register('core.auth');
	FormideOS.register('core.websocket');
	FormideOS.register('core.device');
	FormideOS.register('core.log', FormideOS.config.get('log'));
	FormideOS.register('core.rest');
	FormideOS.register('core.files');
	FormideOS.register('core.printer', FormideOS.config.get('printer'));
	FormideOS.register('core.slicer', FormideOS.config.get('slicer'));
	FormideOS.register('core.setup');
	// FormideOS.register('core.wifi');
	
	// connect to cloud after other core modules booted
	FormideOS.register('core.cloud', FormideOS.config.get('cloud'));
	
	// app modules
	FormideOS.register('app.interface', FormideOS.config.get('dashboard'));
	FormideOS.register('app.webhook');
	FormideOS.register('app.camera', FormideOS.config.get('camera'));

	// FormideOS.register('update');
	// FormideOS.register('app.led');
});