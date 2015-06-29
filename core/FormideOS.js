/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	This is the core of formideos-client. The global FormideOS variable is defined and all core
 *	utilities are added to it, including the http and ws servers, the moduleManager and the
 *	events manager.
 */
 
// Dependencies
var path 	= require('path');

// FormideOS global object
FormideOS = {};

// Paths
FormideOS.coreRoot = path.resolve(__dirname) + '/';
FormideOS.appRoot = path.resolve(__dirname + '/../') + '/';

// Config
FormideOS.config = require('./utils/config.js')();

// Events
FormideOS.events = require('./utils/events.js');

// Debug
FormideOS.debug = require('./utils/debug.js');

// Global user settings
FormideOS.settings = require('./utils/settings.js')();

// HTTP server
FormideOS.http = require('./utils/http').init();

// WS server
FormideOS.ws = require('./utils/websocket').init();

// Utilities
FormideOS.utils = require('./utils/functions.js');

// Module manager
FormideOS.moduleManager = require('./utils/moduleManager.js')();

// Function to get registered module in a more elegant way than directly accessing the modules object
FormideOS.module = function(moduleName) {
	return FormideOS.moduleManager.getModule(moduleName)
};