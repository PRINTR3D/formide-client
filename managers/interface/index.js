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

var spawn = require('child_process').spawn;
var fs = require('fs');

module.exports =
{
	interface: null,

	init: function()
	{
		this.interface = spawn('node', ['index.js'], {cwd: Printspot.config.get('dashboard.path'), stdio: 'pipe'});

		this.interface.stdout.setEncoding('utf8');

		this.interface.stdout.on('exit', this.onExit);

		this.interface.stdout.on('error', this.onError);

		this.interface.stdout.on('data', this.onData);
	},

	on:
	{
		'processExit': 'stop'
	},

	onExit: function(exit)
	{
		Printspot.debug(exit, true);
	},

	onError: function(error)
	{
		Printspot.debug(error, true);
	},

	onData: function(data)
	{
		Printspot.debug(data);
	},

	stop: function()
	{
		this.kill('SIGINT');
	}
}