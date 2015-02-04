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

// dependencies
var Hapi = require('hapi');

module.exports = function(config)
{
	var http = {};

	http.server = new Hapi.Server();

	http.server.connection(
	{
		port: config.get('app.port'),
		routes:
		{
			cors:
			{
				"origin": ["*"],
				"methods": ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
				"headers": ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
				"credentials": true
			}
		}
	});

	http.server.start(function()
	{
		Printspot.debug('http server running on port ' + http.server.info.uri );
	});

	return http;
}