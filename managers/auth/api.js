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
	routes.post('/login', module.authenticate('local'), function( req, res )
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

	routes.get('/tokens', module.authenticate(['bearer', 'local'], { session: false }), function( req, res )
	{
		res.send( module.accessTokens );
	});

	routes.post('/tokens', function( req, res )
	{
		module.generateAccessToken( function( token )
		{
			res.send( token );
		});
	});

	routes.delete('/tokens/:token', module.authenticate(['bearer', 'local'], { session: false }), function( req, res )
	{
		module.removeAccessToken( req.params.token );
		res.send('OK');
	});

/*
	server.route({
		method: 'POST',
		path: '/changepassword',
		config: {
            auth: 'session'
        },
		handler: function(req, res)
		{
			if(req.payload.password)
			{
				FormideOS.db.User.find({where: {id: req.auth.credentials.id}})
			  	.success(function(user)
			  	{
				  	if( user )
				  	{
					  	user.updateAttributes({ password: req.payload.password }).success(function()
						{
							res('OK');
						});
					}
			  	});
		  	}
		}
	});
*/

};