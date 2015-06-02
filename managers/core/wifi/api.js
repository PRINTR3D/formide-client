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
	routes.get('/client/:ssid/:password', FormideOS.manager('core.http').server.permissions.check('wifi'), function( req, res )
	{
		module.connect(req.params.ssid, req.params,password, function( response )
		{
			res.send( response );
		})
	});

	routes.get('/ap/:ssid/:password', FormideOS.manager('core.http').server.permissions.check('wifi'), function( req, res )
	{

	});
}