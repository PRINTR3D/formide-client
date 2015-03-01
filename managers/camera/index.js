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
	command: "fswebcam -d /dev/video0 -r 320x240 image.jpg",
	interval: 2000,

	init: function()
	{
		//setInterval(this.takeSnapshot, this.interval);
	},

	takeSnapshot: function()
	{
		exec(this.command, { cwd: __dirname }, function(err, stdout, stderr)
		{
			if(err)
			{
				Printspot.debug(err);
			}

			if(stderr)
			{
				Printspot.debug(stderr);
			}
		});
	}
}