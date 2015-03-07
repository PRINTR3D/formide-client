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
express = require('express');

module.exports = function(config, debug)
{
	var http = {};

	http.app = express();
	http.server = require('http').Server(http.app);
	http.server.listen( config.get('app.port'), function()
	{
		debug('http server running on port ' + http.server.address().port );
	});

	return http;
}