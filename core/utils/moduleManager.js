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

var fs = require('fs');

module.exports = function(formideos) {
	
	/*
	 * Private
	 */
	var modules = [];
	var activeModules = [];
	
	var loadModule = function(moduleLocation, moduleName, core) {
		
		core = core || false;
		var moduleRoot = formideos.appRoot + moduleLocation;
		
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
		
		if (fs.existsSync(moduleRoot + '/index.js')) {
			moduleInfo.hasIndex = true;
		}
		else {
			formideos.debug.log("Module " + moduleName + " could not be loaded. No index.js file found");
			return;
		}
		
		if (fs.existsSync(moduleRoot + '/package.json')) {
			try {
				var pack = require(moduleRoot + '/package.json');
				moduleInfo.package = pack;
				moduleInfo.version = pack.version;
			}
			catch (e) {
				formideos.debug.log("module " + moduleName + " could not be loaded. Problem with loading package.json: " + e);
			}
		}
		
		if (fs.existsSync(moduleRoot + '/config.json')) {
			try {
				var config = require(moduleRoot + '/config.json');
				moduleInfo.config = config;
			}
			catch (e) {
				formideos.debug.log("module " + moduleName + " could not be loaded. Problem with loading config.json: " + e);
			}
		}
		else if (FormideOS.config.get(moduleName)) {
			moduleInfo.config = FormideOS.config.get(moduleName);
		}
		
		modules[moduleName] = {
			info: moduleInfo,
			instance: require(moduleRoot + '/index.js'),
			status: 'loaded'
		}
		
		formideos.debug.log("module " + moduleName + " loaded");
		formideos.events.emit("moduleManager.moduleLoaded", module.info);
		return modules[moduleName];
	}
	
	var getModule = function(moduleName) {
		if (modules[moduleName] !== undefined) {
			return modules[moduleName];
		}
		else {
			formideos.debug.log("Unknown module requested: " + moduleName);
		}
	}
	
	var activateModule = function(moduleName) {
		var module = getModule(moduleName);
		
		if(typeof module.instance.exposeSettings === 'function') {
			module.info.exposeSettings = module.instance.exposeSettings();
			formideos.settings.addModuleSettings(moduleName, module.info.exposeSettings);
		}
		
		if(typeof module.instance.init === 'function') {
			module.instance.init(module.info.config);
		}
		
		if (fs.existsSync(module.info.root + '/api.js')) {
			module.hasHTTP = true;
			
			// register module's api as sub-app in express server
			var router = express.Router();
			router.use(formideos.http.permissions.check(module.info.namespace, module.info.config.permission));
			require(module.info.root + '/api.js')(router, module.instance);
			formideos.http.app.use('/api/' + module.info.namespace, router);
		}
		
		if (fs.existsSync(module.info.root + '/websocket.js')) {
			module.hasWS = true;
			
			// register module's ws api
			var wsNamespace = formideos.ws.of('/' + module.info.namespace);
			require(module.info.root + '/websocket.js')(wsNamespace, module.instance);
		}
		
		module.status = 'active';
		formideos.debug.log("module " + moduleName + " activated");
		formideos.events.emit("moduleManager.moduleActivated", module.info);
		
		return module;
	}
	
	var disposeModule = function(moduleName) {
		if (modules[moduleName] !== undefined) {
			var module = modules[moduleName];
			if(typeof module.instance.dispose === 'function') {
				module.instance.dispose();
			}
			formideos.events.emit("moduleManager.moduleDisposed", module.info);
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