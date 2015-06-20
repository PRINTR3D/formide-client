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

	// core modules, don't edit these when you don't know what you're doing!
	FormideOS.register('core/modules/http', 		'http',			true);
	FormideOS.register('core/modules/process', 		'process',		true);
	FormideOS.register('core/modules/db', 			'db',			true);
	FormideOS.register('core/modules/settings', 	'settings',		true);
	FormideOS.register('core/modules/auth', 		'auth',			true);
	FormideOS.register('core/modules/websocket', 	'websocket',	true);
	FormideOS.register('core/modules/device', 		'device',		true);
	FormideOS.register('core/modules/log', 			'log',			true);
	FormideOS.register('core/modules/files', 		'files',		true);
	FormideOS.register('core/modules/printer', 		'printer',		true);
	FormideOS.register('core/modules/slicer', 		'slicer',		true);
	FormideOS.register('core/modules/setup', 		'setup',		true);
	// FormideOS.register('core/modules/wifi', 		'wifi',			true);
	FormideOS.register('core/modules/update', 		'update',		true);
	// FormideOS.register('core/modules/led', 		'led',			true);
	
	// connect to cloud after other core modules booted
	FormideOS.register('core/modules/cloud', 		'cloud',		true);
	
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