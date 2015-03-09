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
	process: null,

	init: function(config)
	{
		fs.exists(config.path, function(exists)
		{
			if(exists)
			{
				this.process = spawn('node', ['index.js'], {cwd: FormideOS.appRoot + config.path, stdio: 'pipe'});
				this.process.stdout.setEncoding('utf8');
				this.process.stdout.on('exit', this.onExit);
				this.process.stdout.on('error', this.onError);
				this.process.stdout.on('data', this.onData);
			}
			else
			{
				FormideOS.manager('debug').log('interface directory not found', true);
			}
		}.bind(this));
	},

	on:
	{
		'processExit': 'stop'
	},

	onExit: function(exit)
	{
		FormideOS.manager('debug').log(exit, true);
	},

	onError: function(error)
	{
		FormideOS.manager('debug').log(error, true);
	},

	onData: function(data)
	{
		FormideOS.manager('debug').log(data);
	},

	stop: function(stop)
	{
		this.process.kill('SIGINT');
	}
}