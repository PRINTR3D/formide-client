/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	This is the module manager of formide-client. As the name says, it manages the life cyle of all
 * 	modules, both core and 3rd party. There are functions for loading, activating and disposing modules,
 *	all of which can be done on the fly without having to restart the application. We also keep track of
 *	some key information about each module, like the root path, it's capabilities and 3rd party package
 *	information.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = function() {

	// array with all loaded modules
	var modules = [];

	/**
	 * This function loads a module and checks if all the needed files and configurations are in place
	 * @param moduleLocation
	 * @param moduleName
	 * @returns {*}
	 */
	function loadModule(moduleLocation, moduleName) {

		var moduleRoot = path.join(FormideClient.appRoot, moduleLocation);

		var moduleInfo = {
			namespace:		moduleName,
			root:			moduleRoot,
			hasIndex: 		false,
			hasHTTP:		false,
			hasWS:			false,
			// exposeSettings:	false,
			config:			false,
			package:		false
		}

		if (fs.existsSync(path.join(moduleRoot, 'index.js'))) {
			moduleInfo.hasIndex = true;
		}
		else {
			FormideClient.log.error("Module " + moduleName + " could not be loaded. No index.js file found");
			return;
		}

		delete require.cache[require.resolve(moduleRoot + '/index.js')];
		var instance = require(moduleRoot + '/index.js')

		if (typeof instance.setup === 'function') {
			instance.setup();
		}

		if (fs.existsSync(path.join(moduleRoot, 'package.json'))) {
			try {
				delete require.cache[require.resolve(moduleRoot + '/package.json')];
				var pack = require(moduleRoot + '/package.json');
				moduleInfo.package = pack;
				moduleInfo.version = pack.version;
			}
			catch (e) {
				FormideClient.log.error("module " + moduleName + " could not be loaded. Problem with loading package.json: " + e);
			}
		}

		if (fs.existsSync(path.join(moduleRoot, 'config.json'))) {
			// load module config if found
			try {
				var config = require(moduleRoot + '/config.json');
				moduleInfo.config = config;
			}
			catch (e) {
				FormideClient.log.error("module " + moduleName + " could not be loaded. Problem with loading config.json: " + e);
			}
		}
		else if (FormideClient.config.get(moduleName)) {
			moduleInfo.config = FormideClient.config.get(moduleName);
		}

		if (moduleInfo.config) {
			FormideClient.config.set(moduleName, moduleInfo.config);
		}

		modules[moduleName] = {
			info: moduleInfo,
			instance: instance,
			status: 'loaded'
		}

		FormideClient.log(moduleName + " loaded");
		FormideClient.events.emit("moduleManager.moduleLoaded", moduleInfo);
		return modules[moduleName];
	}

	/**
	 * Get module info by name
	 * @param moduleName
	 * @returns {*}
	 */
	function getModule(moduleName) {
		if (modules[moduleName] !== undefined) {
			return modules[moduleName];
		}
		else {
			FormideClient.log.warn("Unknown module requested: " + moduleName);
		}
	}

	/**
	 * Activate a module (e.g. run it's init() function)
	 * @param moduleName
	 * @returns {*}
	 */
	function activateModule(moduleName) {
		var module = getModule(moduleName);

		// run module init function if found
		if (typeof module.instance.init === 'function') {
			module.instance.init(module.info.config);
		}

		// load models into DB if found
		if (fs.existsSync(path.join(module.info.root, 'models.js'))) {
			require(module.info.root + '/models.js');
		}

		// load routes into HTTP if found
		if (fs.existsSync(path.join(module.info.root, 'api.js'))) {
			module.hasHTTP = true;

			// register module's api as sub-app in express server
			var router = FormideClient.http.express.Router();
			if (module.info.config.permission === undefined || module.info.config.permission !== false) {
				router.use(FormideClient.http.permissions.isUser);
			}
			// delete require.cache[require.resolve(module.info.root + '/api.js')];
			require(module.info.root + '/api.js')(router, module.instance);

			FormideClient.http.app.use('/api/' + module.info.namespace, router);
		}

		// set module status, log activated, emit event
		module.status = 'active';
		FormideClient.log(moduleName + " activated");
		FormideClient.events.emit("moduleManager.moduleActivated", module.info);

		return module;
	}

	/**
	 * Activate all modules that were loaded so far
	 */
	function activateLoadedModules() {
		for (var i in modules) {
			activateModule(i);
		}
	}

	/**
	 * Get a list of all loaded modules
	 * @returns {Array}
	 */
	function getModules() {
		return modules;
	}

	/**
	 * Get a single module
	 * @param moduleName
	 * @returns {*|Object}
	 */
	function getModule(moduleName) {
		return modules[moduleName];
	};

	/**
	 * Get detailed info for a module
	 * @param moduleName
	 * @returns {*}
	 */
	function getModuleInfo(moduleName) {
		return modules[moduleName].info;
	}

	return {
		loadModule,
		activateModule,
		activateLoadedModules,
		getModules,
		getModule,
		getModuleInfo
	}
}