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
	routes.post('/login', function( req, res )
	{

	});

	routes.post('/logout', function( req, res )
	{

	});

	routes.get('/session', function( req, res )
	{

	});

	routes.get('/token', function( req, res )
	{

	});

	routes.delete('/token/:token', function( req, res )
	{

	});


/*
	var login = function(req, res)
	{
		var message = '';

		if(!req.payload.username || !req.payload.password)
		{
			message = "Missing username or password";
			return res(message);
		}
		else
		{
			FormideOS.db.User
			.find({ where: {username: req.payload.username } })
			.success(function( user )
			{
				if( !user || user.selectedValues.password !== req.payload.password )
				{
					message = 'Invalid username or password';
					return res(message);
				}
				else
				{
					req.auth.session.set( user.selectedValues );
					return res('OK');
				}
			});
		}
	}

	var logout = function(req, res)
	{
		req.auth.session.clear();
		return res('OK');
	}

	server.route({
		method: 'POST',
		path: '/login',
		config: {
			handler: login,
			auth: {
				mode: 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/session',
		config: {
            auth: 'session'
        },
		handler: function(req, res)
		{
			return res(req.auth.isAuthenticated ? req.auth : '0');
		}
	});

	server.route({
		method: 'GET',
		path: '/device',
		config: {
            auth: 'session'
        },
		handler: function(req, res)
		{
			var config = {
				environment: FormideOS.config.__environment,
				ports: {
					app: FormideOS.config.get('app.port'),
					client: FormideOS.config.get('printer.port'),
					slicer: FormideOS.config.get('slicer.port'),
					interface: FormideOS.config.get('dashboard.port')
				},
				version: FormideOS.config.get('app.version'),
				debug: FormideOS.config.get('app.debug'),
				cloud: {
					url: FormideOS.config.get('cloud.url')
				},
				mac: FormideOS.macAddress
			}

			res(config);
		}
	});

	server.route({
		method: 'POST',
		path: '/logout',
		config: {
            handler: logout,
            auth: 'session'
        }
	});

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