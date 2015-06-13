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
FormideOS 	= require('./core/FormideOS')();

getMac.getMac(function(err, macAddress) {
	
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac') || macAddress;

	// core modules
	FormideOS.register('core/modules/http');
	FormideOS.register('core/modules/process');
	FormideOS.register('core/modules/db');
	FormideOS.register('core/modules/settings');
	FormideOS.register('core/modules/auth');
	FormideOS.register('core/modules/websocket');
	FormideOS.register('core/modules/device');
	FormideOS.register('core/modules/log', FormideOS.config.get('log'));
	FormideOS.register('core/modules/files');
	FormideOS.register('core/modules/printer', FormideOS.config.get('printer'));
	FormideOS.register('core/modules/slicer', FormideOS.config.get('slicer'));
	FormideOS.register('core/modules/setup');
	// FormideOS.register('core/modules/wifi');
	// FormideOS.register('core/modules/update');
	
	// connect to cloud after other core modules booted
	FormideOS.register('core/modules/cloud', FormideOS.config.get('cloud'));
	
	// app modules
	FormideOS.register('app/modules/interface', FormideOS.config.get('dashboard'));
	FormideOS.register('node_modules/formideOS-module-webhook');
	FormideOS.register('app/modules/camera', FormideOS.config.get('camera'));
	// FormideOS.register('app/modules/led');
});