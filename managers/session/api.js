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
	/*
app.use(passport.initialize());
	app.use(passport.session());
*/

	server.route({
		method: 'POST',
		path: '/login',
		handler: function(req, res)
		{
			//console.log(req.payload);
		}
	});

	/*
app.post('/login', passport.authenticate('local'), function(req, res)
	{
		res.send(req.user);
	});
	*/

	server.route({
		method: 'GET',
		path: '/session',
		handler: function(req, res)
		{
			res(false);
		}
	});

	/*
	app.get('/session', function(req, res)
	{
		res.send(req.isAuthenticated() ? req.user : '0');
	});
	*/

	server.route({
		method: 'GET',
		path: '/device',
		handler: function(req, res)
		{
			var config = {
				environment: Printspot.config.__environment,
				ports: {
					app: Printspot.config.get('app.port'),
					client: Printspot.config.get('printer.port'),
					slicer: Printspot.config.get('slicer.port'),
					interface: Printspot.config.get('dashboard.port')
				},
				version: Printspot.config.get('app.version'),
				debug: Printspot.config.get('app.debug'),
				cloud: {
					url: Printspot.config.get('cloud.url'),
					port: Printspot.config.get('cloud.port')
				},
				mac: Printspot.macAddress
			}

			res(config);
		}
	});

	server.route({
		method: 'POST',
		path: '/logout',
		handler: function(req, res)
		{

		}
	});

	/*
	app.post('/logout', function(req, res)
	{
		req.logOut();
		res.send(200);
	});
	*/

	server.route({
		method: 'POST',
		path: '/changepassword',
		handler: function(req, res)
		{

		}
	});

	/*
	app.post('/changepassword', function(req, res)
	{
		if(req.body.password)
		{
			Printspot.db.User.find({where: {id: req.user.id}})
		  	.success(function(user)
		  	{
			  	user.updateAttributes({ password: req.body.password }, ['password']).success(function()
				{
					res.send('OK');
				});
		  	});
	  	}
	});
	*/

	server.route({
		method: 'POST',
		path: '/settings',
		handler: function(req, res)
		{

		}
	});

	/*
	app.post('/settings', function(req, res)
	{
		if(req.isAuthenticated())
		{
			// do something with user settings
		}
	});
*/
};