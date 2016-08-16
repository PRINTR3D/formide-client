/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	This is the module manager of formideos-client. As the name says, it manages the lifecyle of all
 * 	modules, both core and 3rd party. There are fucntions for loading, activating and disposing modules,
 *	all of which can be done on the fly without having to restart the application. We also keep track of
 *	some key information about each module, like the root path, it's capabilities and 3rd party package
 *	information.
 */

var fs      = require('fs');
var path    = require('path');

module.exports = function() {

	/*
	 * Private
	 */
	var modules = [];
	var activeModules = [];

	var loadModule = function(moduleLocation, moduleName, core) {

		core = core || false;
		var moduleRoot = path.join(FormideOS.appRoot, moduleLocation);

		var moduleInfo = {
			namespace:		moduleName,
			root:			moduleRoot,
			hasIndex: 		false,
			hasHTTP:		false,
			hasWS:			false,
			exposeSettings:	false,
			config:			false,
			package:		false,
			core:			core
		}

		if (fs.existsSync(path.join(moduleRoot, 'index.js'))) {
			moduleInfo.hasIndex = true;
		}
		else {
			FormideOS.log.error("Module " + moduleName + " could not be loaded. No index.js file found");
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
				FormideOS.log.error("module " + moduleName + " could not be loaded. Problem with loading package.json: " + e);
			}
		}

		if (fs.existsSync(path.join(moduleRoot, 'config.json'))) {
			try {
				delete require.cache[require.resolve(moduleRoot + '/config.json')];
				var config = require(moduleRoot + '/config.json');
				moduleInfo.config = config;
			}
			catch (e) {
				FormideOS.log.error("module " + moduleName + " could not be loaded. Problem with loading config.json: " + e);
			}
		}
		else if (FormideOS.config.get(moduleName)) {
			moduleInfo.config = FormideOS.config.get(moduleName);
		}

		if (moduleInfo.config) {
			FormideOS.config.set(moduleName, moduleInfo.config);
		}

		modules[moduleName] = {
			info: moduleInfo,
			instance: instance,
			status: 'loaded'
		}

		FormideOS.log(moduleName + " loaded");
		FormideOS.events.emit("moduleManager.moduleLoaded", moduleInfo);
		return modules[moduleName];
	}

	var getModule = function(moduleName) {
		if (modules[moduleName] !== undefined) {
			return modules[moduleName];
		}
		else {
			FormideOS.log.warn("Unknown module requested: " + moduleName);
		}
	}

	var activateModule = function(moduleName) {
		var module = getModule(moduleName);

		if(typeof module.instance.init === 'function') {
			module.instance.init(module.info.config);
		}

		if (fs.existsSync(path.join(module.info.root, 'models.js'))) {
			// uncache and load database models for module
			delete require.cache[require.resolve(module.info.root + '/models.js')];
			require(module.info.root + '/models.js');
		}

		if (fs.existsSync(path.join(module.info.root, 'api.js'))) {
			module.hasHTTP = true;

			// register module's api as sub-app in express server
			var router = FormideOS.http.express.Router();
			if (module.info.config.permission === undefined || module.info.config.permission !== false) {
				router.use(FormideOS.http.permissions.isUser);
			}
			delete require.cache[require.resolve(module.info.root + '/api.js')];
			require(module.info.root + '/api.js')(router, module.instance);

			FormideOS.http.app.use('/api/' + module.info.namespace, router);
		}

		module.status = 'active';
		FormideOS.log(moduleName + " activated");
		FormideOS.events.emit("moduleManager.moduleActivated", module.info);

		return module;
	}

	var disposeModule = function(moduleName) {
		if (modules[moduleName] !== undefined) {
			var module = modules[moduleName];
			if(typeof module.instance.dispose === 'function') {
				module.instance.dispose();
			}
			FormideOS.log("module " + moduleName + " disposed");
			FormideOS.events.emit("moduleManager.moduleDisposed", module.info);
			delete modules[moduleName];
		}
	}

	var activateLoadedModules = function() {
		for(var i in modules) {
			activateModule(i);
		}
	}

	var reloadModule = function(moduleName) {
		disposeModule(moduleName);
		loadModule("node_modules/" + moduleName, moduleName);
		activateModule(moduleName);
	}

	/*
	 * Public
	 */
	this.loadModule = loadModule;
	this.activateModule = activateModule;
	this.disposeModule = disposeModule;
	this.activateLoadedModules = activateLoadedModules;
	this.reloadModule = reloadModule;

	this.getModules = function() {
		return modules;
	};

	this.getModule = function(moduleName) {
		return getModule(moduleName).instance;
	};

	this.getModuleInfo = function(moduleName) {
		return getModule(moduleName).info;
	}

	this.getModuleStatus = function(moduleName) {
		return getModule(moduleName).status;
	};

	return this;
}
