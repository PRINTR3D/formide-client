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

module.exports = function(server)
{
	/**
	 * Get a list of printer commands
	 */
	server.route({
		method: 'GET',
		path: '/api/printer',
		handler: function(req, res)
		{
			res(Printspot.config.get('channels.dashboard'));
		}
	});

	/**
	 * Get the current status of the printer
	 */
	server.route({
		method: 'GET',
		path: '/api/printer/status',
		handler: function(req, res)
		{
			Printspot.events.once('printerStatus', function(response)
			{
				res(response.data)
			});
		}
	});

	/**
	 * Send a command to the printer
	 */
	server.route({
		method: 'GET',
		path: '/api/printer/{command}',
		handler: function(req, res)
		{
			// load channels from config
			Object.keys(Printspot.config.get('channels.dashboard')).forEach(function(method)
			{
				(function(realMethod)
				{
					if(req.params.command == realMethod)
					{
						var expected = Printspot.config.get('channels.dashboard')[realMethod];
						var given = req.query;
						var correct = true;

						for(key in expected)
						{
							if(!given.hasOwnProperty(expected[key]))
							{
								correct = false;
							}
						};

						if(correct)
						{
							if(req.params.command == 'start')
							{
								req.query.hash = Printspot.config.get('paths.gcode') + '/' + req.query.hash;
							}

							var json = {
								"type": realMethod,
								"data": req.query
							};

							Printspot.events.emit('dashboardPush', json);
							res({status: 200, message: 'OK'});
						}
						else
						{
							res({status: 402, message: 'ERR: param missing'});
						}
					}

				})(method);
			});
		}
	});
}