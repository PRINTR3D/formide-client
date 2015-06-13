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

module.exports = function(namespace, module)
{
	namespace.on('connection', function( socket )
	{
		FormideOS.manager('events').on('slicer.slice', function( data )
		{
			socket.emit('slice', data);
		});

		FormideOS.manager('events').on('slicer.finished', function( data )
		{
			socket.emit('finished', data);
		});
	});
};