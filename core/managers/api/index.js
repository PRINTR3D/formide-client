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
var bodyParser		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var methodOverride	= require('method-override');
var session 		= require('express-session')

// app configuration
Printspot.manager('app').use(bodyParser.urlencoded({ 'extended': 'true' }));
Printspot.manager('app').use(bodyParser.json());
Printspot.manager('app').use(bodyParser.json({ type: 'application/vnd.api+json' }));
Printspot.manager('app').use(cookieParser());
Printspot.manager('app').use(methodOverride());
Printspot.manager('app').use(session({ secret: 'much_secret_many_safety_wow', resave: true, saveUninitialized: true }));
Printspot.manager('app').all('/*', function(req, res, next)
{
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

require('./resources.js')(Printspot.manager('app'), Printspot.manager('db').sequelize);
require('./files.js')(Printspot.manager('app'));
require('./queue.js')(Printspot.manager('app'));
require('./session.js')(Printspot.manager('app'), Printspot.macAddress);

// register api in printspot
Printspot.register('api', Printspot.app);