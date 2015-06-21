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
 
FormideOS = {};

var path 	= require('path');

// define global FormideOS object
module.exports = function() {

	// global directories
	FormideOS.coreRoot = path.resolve(__dirname) + '/';
	FormideOS.appRoot = path.resolve(__dirname + '/../') + '/';

	// global config
	FormideOS.config = require('./utils/config.js')();

	// register events
	FormideOS.events = require('./utils/events.js');

	// register debug
	FormideOS.debug = require('./utils/debug.js');

	// global user settings
	FormideOS.settings = require('./utils/settings.js')(FormideOS);
	
	// global http server
	FormideOS.http = require('./utils/http');
	
	// global ws server
	FormideOS.ws = require('./utils/websocket');

	// register util functions
	FormideOS.utils = require('./utils/functions.js');
	
	// module manager
	FormideOS.moduleManager = require('./utils/moduleManager.js')(FormideOS);
	
	// get registered module
	FormideOS.module = function(moduleName) {
		return FormideOS.moduleManager.getModule(moduleName)
	};
};