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

var net = require('net');

// tcp connection to the printer driver or simulator on given port
global.comm.client = net.connect({port: global.config.get('client.port')}, function() {
	global.log('info', 'qclient connected', {port: global.config.get('client.port')});
});

// when client produces error, log this
global.comm.client.on('error',function(err) {
	console.error('error connecting to nsclient on port', global.config.get('client.port'));
	throw err;
});