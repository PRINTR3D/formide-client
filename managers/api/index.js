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
var express 		= require('express');
var bodyParser		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var methodOverride	= require('method-override');
var session 		= require('express-session');
var app 			= express();

module.exports =
{
	server: null,

	init: function(config)
	{
		this.server = app.listen(config.port);

		// app configuration
		app.use(bodyParser.urlencoded({ 'extended': 'true' }));
		app.use(bodyParser.json());
		app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
		app.use(cookieParser());
		app.use(methodOverride());
		app.use(session({ secret: 'much_secret_many_safety_wow', resave: true, saveUninitialized: true }));

		app.all('/*', function(req, res, next)
		{
			res.header("Access-Control-Allow-Origin", req.headers.origin);
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
			res.header("Access-Control-Allow-Credentials", "true");
			next();
		});

		require('./rest')(app, Printspot.manager('database').db, Printspot.manager('database').sequelize);
		require('./files.js')(app);
		require('./queue.js')(app);
		require('./session.js')(app, Printspot.macAddress);
	}
}