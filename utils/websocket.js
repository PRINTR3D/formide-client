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

module.exports = function(http, debug)
{
	var connection = {};

	http.server.register(
	{
	    register: require('hapio'),
    },
    function(err)
    {
        if(err)
        {
			throw err;
	    }
	    else
	    {
		    debug('websockets running on port ' + http.server.info.uri );
	    }
	}.bind(this));

	connection = http.server.plugins.hapio.io;

	return connection;
}