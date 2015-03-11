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

// require dependencies
var getMac 	= require('getmac');

// define global objects
FormideOS 	= require('./FormideOS')();
_ 			= require('underscore');

function registerInit(name/*, ...*/) {
	// Use argument [1..] for manager.init(/*...*/).
	var args = Array.prototype.slice.call(arguments, 1);

	// Make domain for this manager so that we can catch errors
	var domain = require('domain').create();
	domain.name = name;
	domain.enter();
	var manager = FormideOS.register(name);
	manager.init.apply(manager, args);
	domain.exit();

	domain.on('error',onDomainError.bind(null,domain));

	return manager;
}

function onDomainError(domain,error) {
	console.error('An error occurred in domain "'+domain.name+'": ', error, error.stack);
	throw error;
}

getMac.getMac(function(err, macAddress)
{
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac', macAddress);

	// core modules
	registerInit('core.http');
	registerInit('core.process');
	registerInit('core.db');
	registerInit('core.auth');
	registerInit('core.websocket');
	registerInit('core.device');

	// app modules
	registerInit('app.log',FormideOS.config.get('log'));
	registerInit('app.rest');
	registerInit('app.files');
	registerInit('app.printer',FormideOS.config.get('printer'));
	registerInit('app.slicer',FormideOS.config.get('slicer'));
	registerInit('app.interface',FormideOS.config.get('dashboard'));
	registerInit('app.setup');
	registerInit('app.cloud',FormideOS.config.get('cloud'));

	// under development
	//registerInit('cron').init();
	//registerInit('led').init();
	//registerInit('camera').init(FormideOS.config.get('camera'));
	//registerInit('wifi').init();
	//registerInit('update').init();
});