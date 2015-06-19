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

module.exports = function(moduleInstanceLocation, moduleInstanceName) {
	var d = domain.create();
	d.name = moduleInstanceLocation;

	d.on('error', function(err) {
		console.error(err.stack);
		return process.exit(1); // kill the whole thing
	});

	d.add(FormideOS.module('events'));

	d.run(function() {

		var moduleInstanceRoot = FormideOS.appRoot + moduleInstanceLocation;

		// check if moduleInstance has index file
		if(fs.existsSync(moduleInstanceRoot + '/index.js')) {
			
			var moduleInstance = reload(moduleInstanceRoot + '/index.js');
			
			if(moduleInstanceName.indexOf('core.') !== -1) {
				moduleInstanceName = moduleInstanceName.split('.')[1]; // remove core. from urls
			}
			
			// construct module info
			var moduleInfo = {
				hasHTTP: false,
				hasWS: false,
				config: false,
				version: null,
				package: null,
				namespace: moduleInstanceName,
				root: moduleInstanceRoot
			};
			
			// add debug to module
			moduleInstance.debug = reload('utils-debug')(moduleInstanceRoot);
			
			// add version number when available
			if (fs.existsSync(moduleInstanceRoot + '/package.json')) {
				var npmPackage = reload(moduleInstanceRoot + '/package.json');
				moduleInfo.package = npmPackage;
				moduleInfo.version = npmPackage.version;
			}
			
			// load config if exists and add to existing FormideOS config or add existing config to module register
			if (fs.existsSync(moduleInstanceRoot + '/config.json')) {
				var config = reload(moduleInstanceRoot + '/config.json');
				moduleInfo.config = config;
				FormideOS.config.set(moduleInstanceName, config);
			}
			else if (FormideOS.config.get(moduleInstanceName)) {
				moduleInfo.config = FormideOS.config.get(moduleInstanceName);
			}
			
			// add module settings to global user settings
			if (FormideOS.config.get(moduleInstanceName) && FormideOS.config.get(moduleInstanceName).exposeSettings) {
				FormideOS.settings.addModuleSettings(moduleInstanceName, FormideOS.config.get(moduleInstanceName).exposeSettings);
			}

			// load module http api if exists
			if (fs.existsSync(moduleInstanceRoot + '/api.js')) {
				moduleInfo.hasHTTP = true;
				
				// register as sub-app in express server
				var router = express.Router();
				router.use(FormideOS.module('http').server.permissions.check(moduleInstanceName, moduleInfo.config.permission));
				reload(moduleInstanceRoot + '/api.js')(router, moduleInstance);
				FormideOS.module('http').server.app.use('/api/' + moduleInstanceName, router);
			}

			// load module ws api if exists
			if(fs.existsSync(moduleInstanceRoot + '/websocket.js')) {
				moduleInfo.hasWS = true;
				var namespace = FormideOS.module('websocket').connection.of('/' + moduleInstanceName);
				reload(moduleInstanceRoot + '/websocket.js')(namespace, moduleInstance);
			}
			
			// do init function if exists
			if (typeof moduleInstance.init === 'function') {
				moduleInstance.init(FormideOS.config.get(moduleInstanceName));
			}
			
			// check if moduleInstance already exists or something with the same name does
			if(FormideOS.modules[moduleInstanceName] === undefined) {
				FormideOS.module('debug').log('Loading module: ' + moduleInstanceLocation);
				FormideOS.modulesInfo[moduleInstanceName] = moduleInfo;
				FormideOS.modules[moduleInstanceName] = moduleInstance;
			}
			else {
				FormideOS.module('debug').log('Module with namespace ' + moduleInstanceName + ' already exists', true);
			}
		}
		else {
			FormideOS.module('debug').log('Module does not have a required index.js file', true);
		}
	}.bind(moduleInstanceLocation));
}