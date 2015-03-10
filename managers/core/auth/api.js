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
	routes.post('/login', FormideOS.manager('core.http').server.auth.authenticate('local'), function( req, res )
	{
		res.send( req.user );
	});

	routes.get('/logout', function( req, res )
	{
		req.logout();
	});

	routes.get('/session', function( req, res )
	{
		res.send( req.user );
	});

	routes.get('/tokens', function( req, res )
	{
		module.getAccessTokens(function( tokens )
		{
			res.send( tokens );
		});
	});

	routes.post('/tokens', function( req, res )
	{
		module.generateAccessToken( ['auth', 'rest'], function( token )
		{
			res.send( token );
		});
	});

	routes.delete('/tokens/:token', FormideOS.manager('core.http').server.auth.authenticate(['bearer', 'local'], { session: false }), function( req, res )
	{
		module.deleteAccessToken( req.params.token, function( response )
		{
			res.send( response );
		});
	});

	routes.post('/password', FormideOS.manager('core.http').server.auth.authenticate(['local']), function( req, res )
	{
		if(req.body.password)
		{
			module.changePassword(req.body.password, function( response )
			{
				res.send( response );
			});
		}
	});
};