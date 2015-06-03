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

var fs = require('fs');
var observed = require('observed');

module.exports = function (FormideOS) {

	var env = process.env.NODE_ENV || 'development';
	var cfg = JSON.parse(fs.readFileSync(FormideOS.appRoot + FormideOS.config.get('settings.path') + '/settings.json', {encoding: 'utf8'}));

	var ee = observed(cfg);

	ee.on('change', function() {
		fs.writeFileSync(FormideOS.appRoot + FormideOS.config.get('settings.path') + '/settings.json', JSON.stringify(cfg));
	});

	return cfg;
};
