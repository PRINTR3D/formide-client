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
	dashboard: null,

	init: function()
	{
		fs.exists(Printspot.config.get('dashboard.path'), function(exists)
		{
			if(exists)
			{
				this.dashboard = spawn('node', ['index.js'], {cwd: Printspot.config.get('dashboard.path'), stdio: 'pipe'});
				this.dashboard.stdout.setEncoding('utf8');
				this.dashboard.stdout.on('exit', this.onExit);
				this.dashboard.stdout.on('error', this.onError);
				this.dashboard.stdout.on('data', this.onData);
			}
			else
			{
				Printspot.debug('interface directory not found', true);
			}
		}.bind(this));
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

	stop: function(stop)
	{
		this.kill('SIGINT');
	}
}