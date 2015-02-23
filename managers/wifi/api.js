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

module.exports = function(server, module)
{
	server.route([

		{
			method: 'GET',
			path: '/api/wifi/client/{ssid}/{password}'
			handler: function(req, res)
			{
				module.connect(req.params.ssid, req.params,password, function( response )
				{
					res( response );
				})
				// set wifi to client mode and connect to certain ssid with password
			}
		},

		{
			method: 'GET',
			path: '/api/wifi/ap/{ssid}/{password}'
			handler: function(req, res)
			{
				// set wifi to AP mode with certain ssid and password
			}
		}

	]);
}