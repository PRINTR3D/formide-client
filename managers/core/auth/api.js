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
	routes.post('/login', FormideOS.manager('core.http').server.auth.authenticate('local-login'), function( req, res )
	{
		res.send( req.user );
	});

	routes.get('/logout', FormideOS.manager('core.http').server.permissions.check('auth'), function( req, res )
	{
		req.logout();
		res.send({
			status: 200,
			message: 'logged out'
		});
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
		req.checkBody('permissions', 'permissions invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		module.generateAccessToken( req.body.permissions, function( token )
		{
			res.send( token );
		});
	});

	routes.delete('/tokens/:token', function( req, res )
	{
		req.checkParams('token', 'token invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		module.deleteAccessToken( req.params.token, function( response )
		{
			res.send( response );
		});
	});

	routes.post('/password', FormideOS.manager('core.http').server.auth.authenticate(['local-login']), function( req, res )
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