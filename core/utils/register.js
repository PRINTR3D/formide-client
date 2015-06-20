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

var fs 			= require('fs');

module.exports = function(moduleInstanceLocation, moduleInstanceName, core) {
	
	core = core || false;
	var moduleInstanceRoot = FormideOS.appRoot + moduleInstanceLocation;

	// check if moduleInstance has index file
	if(fs.existsSync(moduleInstanceRoot + '/index.js')) {
		
		if(moduleInstanceName.indexOf('core.') !== -1) {
			moduleInstanceName = moduleInstanceName.split('.')[1]; // remove core. from urls
		}
		
		// construct module info
		var moduleInfo = {
			hasHTTP: false,
			hasWS: false,
			config: false,
			exposeSettings: false,
			version: null,
			package: null,
			namespace: moduleInstanceName,
			root: moduleInstanceRoot,
			core: core
		};
		
		// check if moduleInstance already exists or something with the same name does
		if(FormideOS.modulesInfo[moduleInstanceName] === undefined) {
			FormideOS.modulesInfo[moduleInstanceName] = moduleInfo;
		}
		else {
			FormideOS.module('debug').log('Module with namespace ' + moduleInstanceName + ' already exists', true);
		}
	}
	else {
		FormideOS.module('debug').log('Module does not have a required index.js file', true);
	}
	
}