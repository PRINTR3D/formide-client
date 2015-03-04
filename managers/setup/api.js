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
	/**
	 * Get list of networks
	 */
	server.route({
		method: 'GET',
		path: '/api/setup/networks',
		handler: function(req, res)
		{
			module.listNetworks(function( networks )
			{
				return res( networks );
			});
		}
	});

	/**
	 * Send token and wifi credentials
	 */
	server.route({
		method: 'POST',
		path: '/api/setup/token',
		handler: function(req, res)
		{
			// pass wifi credentials
			module.registerToCloud( req.payload.wifi_ssid, req.payload.wifi_password, req.payload.token, function( response )
			{
				return res( response );
			});
		}
	});
};