'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	This is the core of formide-client. The global FormideClient variable is defined and all core
 *	utilities are added to it, including the http and ws servers, the moduleManager and the
 *	events manager.
 */

const path             = require('path');
const sailsDiskAdapter = require('sails-disk');
const initDb 		   = require('./utils/db');
const seed 			   = require('./utils/db/seed');

// FormideClient global object
global.FormideClient = {};

module.exports = dbConfig => {

	// Paths
	FormideClient.coreRoot = path.resolve(__dirname, './');
	FormideClient.appRoot = path.resolve(__dirname, '../');

	// Config
	FormideClient.config = require('./utils/config.js')();

	// Ensure needed files and dirs are available
    require('./utils/ensureNeeds');

	let useImplementation = 'the_element';

	// Client implementation, default is the_element
	try {
		useImplementation = process.env.FORMIDE_CLIENT_IMPLEMENTATION || 'the_element';
		FormideClient.ci = require(`./implementations/${useImplementation}`);
	}
	catch (e) {
		console.warn(`No native client implementation found at implementations/${useImplementation}, continuing without...`);
	}

	// Events
	FormideClient.events = require('./utils/events.js');

	// Debug
	FormideClient.log = require('./utils/log.js');

	// HTTP server
	FormideClient.http = require('./utils/http').init();

	// WS server
	FormideClient.ws = require('./utils/websocket').init();

	// Module manager
	FormideClient.moduleManager = require('./utils/moduleManager.js')();

	// Array to keep track of installed modules
	FormideClient.modules = [];

	// Function to get registered module in a more elegant way than directly
	// accessing the modules object
	FormideClient.module =
		moduleName => FormideClient.moduleManager.getModule(moduleName);

	if (!dbConfig) {
		let storage = path.join(
			FormideClient.config.get('app.storageDir'), 'database_');

		dbConfig = {
			adapters: { disk: sailsDiskAdapter },
			connections: {
				// database for all user generated data
				default: {
					adapter:  'disk',
					filePath: storage
				}
			},
			defaults: { migrate: 'safe' }
		};
	}

	return initDb(dbConfig).then(
		db => {
			seed(db, path.join(FormideClient.config.get('app.storageDir'), 'formidePresets'));
			FormideClient.db = db;
		},
		err => {
			FormideClient.log.error(err);
			process.exit(1);
		});
}
