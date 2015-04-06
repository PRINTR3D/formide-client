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

module.exports = function( managerName, data )
{
	var d = domain.create();
	d.name = managerName;

	d.on('error', function( err )
	{
		FormideOS.manager('core.events').emit('log.error', {message: 'uncaught exception occured', data: err.stack});
	  	FormideOS.manager('debug').log(err.stack, true);
	});

	d.add(FormideOS.manager('core.events'));

	d.run(function()
	{
		managerName = managerName.replace('.', '/');
		managerNamespace = managerName.split('/')[1]; // remove core or app for urls

		FormideOS.manager('debug').log('Loading manager: ' + managerName);

		if(fs.existsSync('managers/' + managerName + '/index.js'))
		{
			var manager = require('../managers/' + managerName + '/index.js');

			// do init function if exists
			if(typeof manager.init === 'function')
			{
				manager.init( data );
			}

			if(fs.existsSync('managers/' + managerName + '/api.js'))
			{
				var router = express.Router();
				require('../managers/' + managerName + '/api.js')(router, manager);
				FormideOS.manager('core.http').server.app.use('/api/' + managerNamespace, router); // register as sub-app in express server
			}

			if(fs.existsSync('managers/' + managerName + '/websocket.js'))
			{
				var namespace = FormideOS.manager('core.websocket').connection.of('/' + managerNamespace);
				require('../managers/' + managerName + '/websocket.js')(namespace, manager);
			}

			if(!(managerName in FormideOS.managers))
			{
				FormideOS.managers[managerName] = manager;
			}
			else
			{
				FormideOS.manager('debug').log('Manager with name ' + managerName + ' already exists', true);
			}
		}
		else
		{
			FormideOS.manager('debug').log('manager does not have an index.js file', true);
		}
	}.bind( managerName, data ));
}