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
	stream: false,
	interval: null,

	init: function( config )
	{
		this.config = config;
	},

	startStream: function( socket )
	{
		if( !this.stream )
		{
			this.interval = setInterval(this.takeSnapshot.bind(this), this.config.interval);
		}
	},

	stopStream: function()
	{
		if( this.stream )
		{
			this.stream = false;
			clearInterval( this.interval );
			this.interval = null;
		}
	},

	takeSnapshot: function()
	{
		exec(this.config.command, { cwd: __dirname }, function(err, stdout, stderr)
		{
			if(err)
			{
				FormideOS.manager('core.debug').log(err);
			}

			if(stderr)
			{
				FormideOS.manager('core.debug').log(stderr);
			}

			FormideOS.manager('core.events').emit('camera.refresh');

		}.bind(this));
	}
}