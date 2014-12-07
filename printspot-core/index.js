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
global.config 		= require('./../printspot-config/config.json');

// dependencies =================
var express 		= require('express');
var session 		= require('express-session')
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var dbConfig		= require('./../printspot-config/db.json');
var getMac			= require('getmac');
var os				= require('os');

// app and server ================
global.db			= require('./server/db.js');
global.app 			= express();
global.server 		= global.app.listen(global.config.local.port);

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
global.app.use(methodOverride());
//global.app.use(session({secret: 'RANDOMRANDOM'}));

global.app.all('/*', function(req, res, next)
{
	res.header("Access-Control-Allow-Origin", global.config.local.host + ':' + global.config.local.interfaceport);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

getMac.getMac(function(err, macAddress)
{
	if(global.config.online.mac != '')
	{
		macAddress = global.config.online.mac;
	}

	global.socket = require('./server/socket.js')(macAddress);

	// routes ========================
	require('./server/routes/api.js')(global.app);
	require('./server/routes/session.js')(global.app);
	require('./server/routes/slicing.js')(global.app);
	require('./server/routes/files.js')(global.app);

	// start back-end app =====================
	global.log('info', 'printspot-core started',
	{
		'version': global.config.version.number,
		'host': global.config.local.host,
		'port': global.config.local.port
	});
});
