/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	This is the bootstrapper of formideos-client. It basically kicks off the formideos core
 *	and loads the core modules. After that, all user installed modules are loaded. Finally,
 *	all loaded modules are activated via the moduleManager.activateLoadedModules function.
 */

// Dependencies
var getMac	= require('getmac');
var pkg		= require('./package.json');

// Load formideos core file
require('./core/FormideOS');

FormideOS.debug.log('==========================================');
FormideOS.debug.log('        Starting FORMIDEOS v' + pkg.version);
FormideOS.debug.log('==========================================');

getMac.getMac(function(err, macAddress) {
	
	// Set mac address (used for cloud connection)
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac') || macAddress;
	
	// Load core modules
	FormideOS.moduleManager.loadModule('core/modules/process', 	'process', 	true);
	FormideOS.moduleManager.loadModule('core/modules/db', 		'db', 		true);
	FormideOS.moduleManager.loadModule('core/modules/settings',	'settings', true);
	FormideOS.moduleManager.loadModule('core/modules/auth', 	'auth', 	true);
	FormideOS.moduleManager.loadModule('core/modules/device', 	'device', 	true);
	FormideOS.moduleManager.loadModule('core/modules/log', 		'log', 		true);
	FormideOS.moduleManager.loadModule('core/modules/files', 	'files', 	true);
	FormideOS.moduleManager.loadModule('core/modules/printer', 	'printer', 	true);
	//FormideOS.moduleManager.loadModule('core/modules/slicer', 	'slicer', 	true);
	FormideOS.moduleManager.loadModule('core/modules/setup', 	'setup',	true);
	//FormideOS.moduleManager.loadModule('core/modules/wifi', 	'wifi',		true);	// Wifi manager is not finished yet
	FormideOS.moduleManager.loadModule('core/modules/update', 	'update', 	true);
	FormideOS.moduleManager.loadModule('core/modules/cloud', 	'cloud',	true);
	
	// Load all 3rd party formideos modules
	for(var i in pkg.dependencies) {
		if (i.indexOf("formide-client-") > -1) {
			FormideOS.moduleManager.loadModule("node_modules/" + i, i);
		}
	}

	// Activate all loaded modules
	FormideOS.moduleManager.activateLoadedModules();
});