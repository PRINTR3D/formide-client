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

module.exports = function(managerName)
{
	return {

		init: function(data) {

			Printspot.debug('Loading manager: ' + managerName);

			if(fs.existsSync('managers/' + managerName + '/index.js'))
			{
				var manager = require('../managers/' + managerName + '/index.js');

				// register listeners
				if(typeof manager.on === 'object')
				{
					Object.keys(manager.on).forEach(function(ev)
					{
						(function(realEv)
						{
							var callback = manager.on[realEv];

							Printspot.events.on(realEv, function(data)
							{
								manager[callback](data);
							});
						})(ev);
					});
				}

				// do init function if exists
				if(typeof manager.init === 'function')
				{
					if(manager.init.length !== arguments.length)
					{
						Printspot.debug('manager ' + managerName + ' takes '+ manager.init.length + ' arguments but ' + arguments.length + ' were given', true);
					}
					else
					{
						manager.init(data);
					}
				}

				if(fs.existsSync('managers/' + managerName + '/api.js'))
				{
					var routes = express();
					require('../managers/' + managerName + '/api.js')(routes, manager);
					Printspot.http.app.use('/api/' + managerName, routes); // register as sub-app in express server
				}

				if(!(managerName in Printspot.managers))
				{
					Printspot.managers[managerName] = manager;
				}
				else
				{
					Printspot.debug('Manager with name ' + managerName + ' already exists', true);
				}
			}
			else
			{
				Printspot.debug('manager does not have an index.js file', true);
			}
		}
	}
}