// index.js

// logging ======================
var argv 			= require('minimist')(process.argv.slice(2));
var winston			= require('winston');

global.logger = new (winston.Logger)({
    transports: [
      	new (winston.transports.File)({filename: '../logs/printspot.log', level: 'debug' })
    ]
  });

global.log = function(level, msg, data) {
	global.logger.log(level, msg, data);
	if(!argv.dev) {
		console.log(msg + data);
	}
}

// set up ========================
global.userConfig	= require('./../printspot-config/userConfig.json');
global.config 		= require('./../printspot-config/config.json');

var express 		= require('express');
var session 		= require('express-session')
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var dbConfig		= require('./../printspot-config/db.json');
var getMac			= require('getmac');
var restful   		= require('epilogue');
var os				= require('os');

global.db			= require('./server/db.js');

var app 			= express();
var server 			= app.listen(global.config.local.port);
var localIO 		= require('socket.io').listen(server);
var onlineIO		= require('socket.io-client')(global.config.online.host + ':' + global.config.online.port);
var ss 				= require('socket.io-stream');
var net				= require('net');
var nsclient		= net.connect({port: global.config.client.port}, function() {
	global.log('info', 'qclient connected', {port: global.config.client.port});
});
/*
var nskatana		= net.connect({port: global.config.katana.port}, function() {
	global.log('info', 'katana connected', {port: global.config.katana.port});
});
*/

// configuration =================
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(session({secret: 'RANDOMRANDOM'}));
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", global.config.local.host + ':' + global.config.local.interfaceport);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

getMac.getMac(function(err, macAddress) {
	
	if(global.config.online.mac != '') {
		macAddress = global.config.online.mac
	}
	
	global.socket = require('./server/socket.js')(localIO, onlineIO, ss, nsclient, macAddress);
	restful.initialize({ app: app });
	
	var sliceprofiles = restful.resource({
	    model: global.db.Sliceprofile,
	    endpoints: ['/api/sliceprofiles', '/api/sliceprofiles/:id']
	});
	
	var printjobs = restful.resource({
	    model: global.db.Printjob,
	    endpoints: ['/api/printjobs', '/api/printjobs/:id']
	});
	
	var materials = restful.resource({
	    model: global.db.Material,
	    endpoints: ['/api/materials', '/api/materials/:id']
	});
	
	var printers = restful.resource({
	    model: global.db.Printer,
	    endpoints: ['/api/printers', '/api/printers/:id']
	});
	
	var users = restful.resource({
	    model: global.db.User,
	    endpoints: ['/api/users', '/api/users/:id']
	});
	
	var modelfiles = restful.resource({
	    model: global.db.Modelfile,
	    endpoints: ['/api/modelfiles', '/api/modelfiles/:id']
	});
	
	var queue = restful.resource({
		model: global.db.Queueitem,
		endpoints: ['/api/queue', '/api/queue/:id']
	})
	
	// routes ========================
	require('./server/routes')(app);
	
	// start back-end app =====================
	global.log('info', 'printspot-core started',  {'version': global.config.version.number, 'host': global.config.local.host, 'port': global.config.local.port});
});