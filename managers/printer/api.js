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

module.exports = function(routes, module)
{
	/**
	 * Get a list of printer commands
	 */
	routes.get('/list', function( req, res )
	{
		res.send(FormideOS.config.get('channels.dashboard'));
	});

	/**
	 * Get the current status of the printer
	 */
	routes.get('/status', function( req, res )
	{
		FormideOS.events.once('printerStatus', function( status )
		{
			res.send( status.data );
		});
	});

	/**
	 * Send a command to the printer
	 */
	routes.get('/control/:command', function( req, res )
	{
		// load channels from config
		Object.keys(FormideOS.config.get('channels.dashboard')).forEach(function(method)
		{
			(function(realMethod)
			{
				if(req.params.command == realMethod)
				{
					var expected = FormideOS.config.get('channels.dashboard')[realMethod];
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
							req.query.hash = FormideOS.config.get('paths.gcode') + '/' + req.query.hash;
						}

						var params = JSON.stringify(req.query);
						params = JSON.parse(params, function( k, v )
						{
							if(k === "") return v;

							if(!parseInt(v))
							{
								return v;
							}
							else
							{
								return parseInt(v);
							}
						});

						var json = {
							"type": realMethod,
							"data": params
						};

						FormideOS.events.emit('dashboardPush', json);
						res.send({
							status: 200,
							message: 'OK'
						});
					}
					else
					{
						res.send({
							status: 402,
							message: 'ERR: param missing'
						});
					}
				}

			})(method);
		});
	});
}