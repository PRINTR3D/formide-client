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

var domain 		= require('domain');
var fs 			= require('fs');
var reload 		= require('require-reload')(require);

module.exports = function(modules) {
	
	this.modules = modules;
	
	this.run = function(moduleName) {
		performInit(modules[moduleName]);
	}
	
	return this;
}

function performInit(module) {
	
	var d = domain.create();
	d.name = module.namespace;

	d.on('error', function(err) {
		console.error(err.stack);
		return process.exit(1); // kill the whole thing
	});

	d.add(FormideOS.module('events'));

	d.run(function() {
		
		var moduleInstanceRoot = module.root;
		var moduleInstanceName = module.namespace;
	
		if(fs.existsSync(moduleInstanceRoot + '/index.js')) {
			
			var moduleInstance = reload(moduleInstanceRoot + '/index.js');
			
			// add debug to module
			moduleInstance.debug = reload('utils-debug')(moduleInstanceRoot);
			
			// add version number when available
			if (fs.existsSync(moduleInstanceRoot + '/package.json')) {
				var npmPackage = reload(moduleInstanceRoot + '/package.json');
				module.package = npmPackage;
				module.version = npmPackage.version;
			}
			
			// load config if exists and add to existing FormideOS config or add existing config to module register
			if (fs.existsSync(moduleInstanceRoot + '/config.json')) {
				var config = reload(moduleInstanceRoot + '/config.json');
				module.config = config;
				FormideOS.config.set(moduleInstanceName, config);
			}
			else if (FormideOS.config.get(moduleInstanceName)) {
				module.config = FormideOS.config.get(moduleInstanceName);
			}
			
			// call exposeSettings function to populate global user settings
			if (typeof moduleInstance.exposeSettings === 'function') {
				var moduleSettings = moduleInstance.exposeSettings();
				module.exposeSettings = moduleSettings;
				FormideOS.settings.addModuleSettings(moduleInstanceName, moduleSettings);
			}
			
			// load module http api if exists
			if (fs.existsSync(moduleInstanceRoot + '/api.js')) {
				module.hasHTTP = true;
				
				// register as sub-app in express server
				var router = express.Router();
				router.use(FormideOS.module('http').server.permissions.check(moduleInstanceName, module.config.permission));
				reload(moduleInstanceRoot + '/api.js')(router, moduleInstance);
				FormideOS.module('http').server.app.use('/api/' + moduleInstanceName, router);
			}
		
			// load module ws api if exists
			if(fs.existsSync(moduleInstanceRoot + '/websocket.js')) {
				module.hasWS = true;
				var namespace = FormideOS.module('websocket').connection.of('/' + moduleInstanceName);
				reload(moduleInstanceRoot + '/websocket.js')(namespace, moduleInstance);
			}
			
			// do init function if exists
			if (typeof moduleInstance.init === 'function') {
				moduleInstance.init(FormideOS.config.get(moduleInstanceName));
			}
			
			// check if moduleInstance already exists or something with the same name does
			if(FormideOS.modules[moduleInstanceName] != undefined) {
				FormideOS.modules[moduleInstanceName] = moduleInstance;
				FormideOS.module('debug').log('Loaded module: ' + moduleInstanceName);
			}
			else {
				FormideOS.module('debug').log('Module with namespace ' + moduleInstanceName + ' does not exist', true);
			}
		}
	}.bind(module));
}