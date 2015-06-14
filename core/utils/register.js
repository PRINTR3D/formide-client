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

var domain 					= require('domain');
var fs 						= require('fs');

module.exports = function(managerLocation, managerName, data) {
	var d = domain.create();
	d.name = managerLocation;

	d.on('error', function(err) {
		FormideOS.manager('events').emit('log.error', {message: 'uncaught exception occured', data: err.stack});
	  	FormideOS.manager('debug').log(err.stack, true);
	});

	d.add(FormideOS.manager('events'));

	d.run(function() {

		FormideOS.manager('debug').log('Loading module: ' + managerLocation);
		var managerRoot = FormideOS.appRoot + managerLocation;

		// check if manager has index file
		if(fs.existsSync(managerRoot + '/index.js')) {
			
			var manager = require(managerRoot + '/index.js');
			
			if(managerName.indexOf('core.') !== -1) {
				managerName = managerName.split('.')[1]; // remove core. from urls
			}
			
			var moduleInfo = {
				hasHTTP: false,
				hasWS: false,
				config: false,
				namespace: managerName,
				root: managerRoot
			};

			// do init function if exists
			if (typeof manager.init === 'function') {
				manager.init(data);
			}
			
			// load config if exists and add to FormideOS config
			if (fs.existsSync(managerRoot + '/config.json')) {
				var config = require(managerRoot + '/config.json');
				moduleInfo.config = config;
				FormideOS.config.set(managerName, config);
			}

			// load module http api if exists
			if (fs.existsSync(managerRoot + '/api.js')) {
				moduleInfo.hasHTTP = true;
				var router = express.Router();
				require(managerRoot + '/api.js')(router, manager);
				FormideOS.manager('http').server.app.use('/api/' + managerName, router); // register as sub-app in express server
			}

			// load module ws api if exists
			if(fs.existsSync(managerRoot + '/websocket.js')) {
				moduleInfo.hasWS = true;
				var namespace = FormideOS.manager('websocket').connection.of('/' + managerName);
				require(managerRoot + '/websocket.js')(namespace, manager);
			}
			
			// check if manager already exists or something with the same name does
			if(!(managerName in FormideOS.managers)) {
				FormideOS.modules[managerName] = moduleInfo;
				FormideOS.managers[managerName] = manager;
			}
			else {
				FormideOS.manager('debug').log('Module with namespace ' + managerName + ' already exists', true);
			}
		}
		else {
			FormideOS.manager('debug').log('Module does not have an index.js file', true);
		}
	}.bind(managerLocation, data));
}