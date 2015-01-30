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

module.exports = function()
{
	Printspot.eventbus.on('camera', function()
	{
		exec('./imagesnap image.jpg', { cwd: __dirname }, function(err, stdout, stderr)
		{
			Printspot.eventbus.emit('internalSuccess', {
				type: 'camera',
				data: 'image captured'
			});
		});
	});
}