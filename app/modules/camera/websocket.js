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

module.exports = function(namespace, module)
{
	namespace.on('connection', function( socket )
	{
		socket.on('start', function( data )
		{
			module.startStream( socket );
		});

		socket.on('stop', function( data )
		{
			module.stopStream();
		});

		FormideOS.manager('core.events').on('camera.refresh', function()
		{
			socket.emit('stream', 'image.jpg?_t=' + ( Math.random() * 100000))
		});
	});
};