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
global.Printspot.app.use(bodyParser.urlencoded({ 'extended': 'true' }));
global.Printspot.app.use(bodyParser.json());
global.Printspot.app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
global.Printspot.app.use(cookieParser());
global.Printspot.app.use(methodOverride());
global.Printspot.app.use(session({ secret: 'much_secret_many_safety_wow' }));
global.Printspot.app.all('/*', function(req, res, next)
{
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

require('./resources.js')(global.Printspot.app, global.Printspot.db.sequelize);
require('./files.js')(global.Printspot.app);
require('./queue.js')(global.Printspot.app);
require('./session.js')(global.Printspot.app, global.Printspot.macAddress);