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

// logging ======================
var argv 			= require('minimist')(process.argv.slice(2));
var winston			= require('winston');

global.logger = new (winston.Logger)(
{
    transports:
    [
		new (winston.transports.File)({filename: '../logs/printspot.log', level: 'debug' }),
		new winston.transports.Console()
    ]
});

global.log = function(level, msg, data)
{
	global.logger.log(level, msg, data);
	if(!argv.dev)
	{
		console.log(msg + data);
	}
}

// config =======================
global.config = require('nodejs-config')(
	__dirname,
	{
<<<<<<< Updated upstream
		development: ['chris.local'],
		production: ['raspberrypi']
=======
		development: ['bouke.local'],
		production: []
>>>>>>> Stashed changes
	}
);

// dependencies =================
var express 		= require('express');
var bodyParser		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var methodOverride	= require('method-override');
var getMac			= require('getmac');
var os				= require('os');
var session 		= require('express-session')

// app and server ================
global.db			= require('./server/db.js');
global.app 			= express();
global.server 		= global.app.listen(global.config.get('app.port'));

// communication =================
global.comm = {};
require('./server/comm/local.js');
require('./server/comm/online.js');
require('./server/comm/client.js');
require('./server/comm/slicer.js');

// app configuration =============
global.app.use(bodyParser.urlencoded({'extended': 'true'}));
global.app.use(bodyParser.json());
global.app.use(bodyParser.json({type: 'application/vnd.api+json'}));
global.app.use(cookieParser());
global.app.use(methodOverride());
global.app.use(session(
{
	secret: 'much_secret_many_safety_wow'
}));

global.app.all('/*', function(req, res, next)
{
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

getMac.getMac(function(err, macAddress)
{
	if(global.config.environment() == 'development')
	{
		macAddress = global.config.get('cloud.mac', macAddress);
	}

	global.socket = require('./server/socket.js')(macAddress);

	// routes ========================
	require('./server/routes/api.js')(global.app);
	require('./server/routes/session.js')(global.app, macAddress);
	require('./server/routes/slicing.js')(global.app);
	require('./server/routes/files.js')(global.app);

	// start back-end app =====================
	global.log('info', 'printspot-core started',
	{
		'version': global.config.get('app.version'),
		'host': global.config.get('app.url'),
		'port': global.config.get('app.port')
	});
});