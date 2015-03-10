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

getMac.getMac(function(err, macAddress)
{
	FormideOS.macAddress = FormideOS.config.get('cloud.softMac', macAddress);

	// core modules
	FormideOS.register('core.http').init();
	FormideOS.register('core.db').init();
	FormideOS.register('core.auth').init();
	FormideOS.register('core.websocket').init();
	FormideOS.register('core.device').init();
	FormideOS.register('core.process').init();

	// app modules
	FormideOS.register('app.log').init(FormideOS.config.get('log'));
	FormideOS.register('app.rest').init();
	FormideOS.register('app.files').init();
	FormideOS.register('app.printer').init(FormideOS.config.get('printer'));
	FormideOS.register('app.slicer').init(FormideOS.config.get('slicer'));
	FormideOS.register('app.interface').init(FormideOS.config.get('dashboard'));
	FormideOS.register('app.setup').init();
	FormideOS.register('app.cloud').init(FormideOS.config.get('cloud'));

	// under development
	//FormideOS.register('cron').init();
	//FormideOS.register('led').init();
	//FormideOS.register('camera').init(FormideOS.config.get('camera'));
	//FormideOS.register('wifi').init();
	//FormideOS.register('update').init();
});