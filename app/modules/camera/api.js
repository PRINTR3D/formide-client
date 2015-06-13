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

var path = require('path');

module.exports = function(routes, module)
{
	/**
	 * Register static directory to serve video stream
	 */
	routes.use('/stream', express.static(path.join(__dirname, 'stream')));

	/**
	 * Start video stream
	 */
	routes.get('/start', FormideOS.manager('http').server.permissions.check('camera'), function( req, res )
	{
		module.startStream();
		res.send({
			status: 200,
			message: 'OK'
		});
	});

	/**
	 * Start video stream
	 */
	routes.get('/stop', FormideOS.manager('http').server.permissions.check('camera'), function( req, res )
	{
		module.stopStream();
		res.send({
			status: 200,
			message: 'OK'
		});
	});
}