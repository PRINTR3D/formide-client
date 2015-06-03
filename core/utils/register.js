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

module.exports = function(managerName, data) {
	var d = domain.create();
	d.name = managerName;

	d.on('error', function(err) {
		FormideOS.manager('core.events').emit('log.error', {message: 'uncaught exception occured', data: err.stack});
	  	FormideOS.manager('debug').log(err.stack, true);
	});

	d.add(FormideOS.manager('core.events'));

	d.run(function() {
		managerName 			= managerName.replace('.', '/');
		var managerLocation 	= managerName.split('/')[0]; // find in core or app
		var managerNamespace 	= managerName.split('/')[1]; // remove core or app for urls
		var managerRoot 		= FormideOS.appRoot + managerLocation + '/modules/' + managerNamespace;

		FormideOS.manager('debug').log('Loading manager: ' + managerName);

		// check if manager has index file
		if(fs.existsSync(managerRoot + '/index.js')) {
			
			// require manager index file
			var manager = require(managerRoot + '/index.js');
			
			var moduleInfo = {
				hasHTTP: false,
				hasWS: false,
				namespace: managerNamespace,
				root: managerRoot
			};

			// do init function if exists
			if (typeof manager.init === 'function') {
				manager.init(data);
			}

			// load module http api if exists
			if (fs.existsSync(managerRoot + '/api.js')) {
				moduleInfo.hasHTTP = true;
				var router = express.Router();
				require(managerRoot + '/api.js')(router, manager);
				FormideOS.manager('core.http').server.app.use('/api/' + managerNamespace, router); // register as sub-app in express server
			}

			// load module ws api if exists
			if(fs.existsSync(managerRoot + '/websocket.js')) {
				moduleInfo.hasWS = true;
				var namespace = FormideOS.manager('core.websocket').connection.of('/' + managerNamespace);
				require(managerRoot + '/websocket.js')(namespace, manager);
			}
			
			// check if manager already exists or something with the same name does
			if(!(managerName in FormideOS.managers)) {
				FormideOS.modules[managerName] = moduleInfo;
				FormideOS.managers[managerName] = manager;
			}
			else {
				FormideOS.manager('debug').log('Manager with name ' + managerName + ' already exists', true);
			}
		}
		else {
			FormideOS.manager('debug').log('manager does not have an index.js file', true);
		}
	}.bind(managerName, data));
}