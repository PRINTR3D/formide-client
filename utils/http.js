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

module.exports = function(config)
{
	var http = {};

	http.app = express();
	http.server = http.app.listen(config.get('app.port'));

	// app configuration
	http.app.use(bodyParser.urlencoded({ 'extended': 'true' }));
	http.app.use(bodyParser.json());
	http.app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
	http.app.use(cookieParser());
	http.app.use(methodOverride());
	http.app.use(session({ secret: 'much_secret_many_safety_wow', resave: true, saveUninitialized: true }));

	http.app.all('/*', function(req, res, next)
	{
		res.header("Access-Control-Allow-Origin", req.headers.origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
		res.header("Access-Control-Allow-Credentials", "true");
		next();
	});

	return http;
}