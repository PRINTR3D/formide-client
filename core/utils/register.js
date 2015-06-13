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

module.exports = function(search, data) {
	var d = domain.create();
	d.name = search;

	d.on('error', function(err) {
		FormideOS.manager('core.events').emit('log.error', {message: 'uncaught exception occured', data: err.stack});
	  	FormideOS.manager('debug').log(err.stack, true);
	});

	d.add(FormideOS.manager('core.events'));

	d.run(function() {

		FormideOS.manager('debug').log('Loading module: ' + search);

		// check if manager has index file
		if(fs.existsSync(managerRoot + '/index.js')) {
			
			if(managerName.indexOf('core.') !== -1) {
				
			}
			
			// require manager index file
			var manager 			= require(managerRoot + '/index.js');
			var managerName 		= manager.name;
			var managerLocation 	= search;
			var managerNamespace	= managerName;
			var managerRoot 		= FormideOS.appRoot + search;
			
			if(managerName.indexOf('core.') !== -1) {
				managerNamespace = managerName.split('.')[1]; // remove core. from urls
			}
			
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
			if(!(managerNamespace in FormideOS.managers)) {
				FormideOS.modules[managerNamespace] = moduleInfo;
				FormideOS.managers[managerNamespace] = manager;
			}
			else {
				FormideOS.manager('debug').log('Module with namespace ' + managerNamespace + ' already exists', true);
			}
		}
		else {
			FormideOS.manager('debug').log('Module does not have an index.js file', true);
		}
	}.bind(search, data));
}