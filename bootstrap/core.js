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
FormideOS 	= require('../core/FormideOS')();

getMac.getMac(function(err, macAddress) {
	
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac') || macAddress;

	// core modules
	FormideOS.register('core/modules/http', 		'http');
	FormideOS.register('core/modules/process', 		'process');
	FormideOS.register('core/modules/db', 			'db');
	FormideOS.register('core/modules/settings', 	'settings');
	FormideOS.register('core/modules/auth', 		'auth');
	FormideOS.register('core/modules/websocket', 	'websocket');
	FormideOS.register('core/modules/device', 		'device');
	FormideOS.register('core/modules/log', 			'log');
	FormideOS.register('core/modules/files', 		'files');
	FormideOS.register('core/modules/printer', 		'printer');
	FormideOS.register('core/modules/slicer', 		'slicer');
	FormideOS.register('core/modules/setup', 		'setup');
	// FormideOS.register('core/modules/wifi', 		'wifi');
	FormideOS.register('core/modules/update', 		'update');
	// FormideOS.register('core/modules/led', 		'led');
	
	// connect to cloud after other core modules booted
	FormideOS.register('core/modules/cloud', 		'cloud');
	
	// check if all settings are there, if not, add them
	FormideOS.settings.checkSettings();
	
	FormideOS.reload = function() {
		var modules = FormideOS.module('settings').getSetting('update', 'modules');

		for(var i in modules) {
			FormideOS.deregister(modules[i]);
			FormideOS.register("node_modules/" + modules[i], modules[i]);
		}
		
		// check settings again (this time also for new 3rd party modules)
		FormideOS.settings.checkSettings();
	}
	
	FormideOS.reload();
});