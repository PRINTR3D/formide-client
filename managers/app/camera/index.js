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

var exec = require('child_process').exec;

module.exports =
{
	config: {},

	init: function( config )
	{
		this.config = config;
		setInterval(this.takeSnapshot.bind(this), config.interval);
	},

	takeSnapshot: function()
	{
		exec(this.config.command, { cwd: __dirname }, function(err, stdout, stderr)
		{
			if(err)
			{
				FormideOS.manager('debug').log(err);
			}

			if(stderr)
			{
				FormideOS.manager('debug').log(stderr);
			}
		}.bind(this));
	}
}