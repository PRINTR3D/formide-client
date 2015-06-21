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

// get FormideOS object
require('../core/FormideOS')();

getMac.getMac(function(err, macAddress) {
	
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac') || macAddress;
	
	FormideOS.moduleManager.loadModule('core/modules/process', 	'process', 	true);
	FormideOS.moduleManager.loadModule('core/modules/db', 		'db', 		true);
	FormideOS.moduleManager.loadModule('core/modules/settings',	'settings', true);
	FormideOS.moduleManager.loadModule('core/modules/auth', 	'auth', 	true);
	FormideOS.moduleManager.loadModule('core/modules/device', 	'device', 	true);
	FormideOS.moduleManager.loadModule('core/modules/log', 		'log', 		true);
	FormideOS.moduleManager.loadModule('core/modules/files', 	'files', 	true);
	FormideOS.moduleManager.loadModule('core/modules/printer', 	'printer', 	true);
	FormideOS.moduleManager.loadModule('core/modules/slicer', 	'slicer', 	true);
	FormideOS.moduleManager.loadModule('core/modules/setup', 	'setup',	true);
	//FormideOS.moduleManager.loadModule('core/modules/wifi', 	'wifi',		true);
	FormideOS.moduleManager.loadModule('core/modules/update', 	'update', 	true);
	//FormideOS.moduleManager.loadModule('core/modules/led', 	'led', 		true);
	
	// Activate all core modules
	FormideOS.moduleManager.activateLoadedModules();
	
	FormideOS.reload = function() {
		var modules = FormideOS.settings.getSetting('update', 'modules');

		for(var i in modules) {
			FormideOS.moduleManager.disposeModule(modules[i]);
			FormideOS.moduleManager.loadModule("node_modules/" + modules[i], modules[i]);
		}
		
		// init all 3rd party modules
		for(var i in modules) {
			FormideOS.moduleManager.activateModule(modules[i]);
		}
		
		// we init the cloud module after all other models to build the correct permission model
		FormideOS.moduleManager.loadModule('core/modules/cloud', 	'cloud',	true);
		FormideOS.moduleManager.activateModule('cloud');
		
		// check all the settings
		FormideOS.settings.checkSettings();
	}
	
	FormideOS.reload();
});