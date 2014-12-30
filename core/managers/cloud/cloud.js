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

// Handles communication with online socketserver and dashboards
module.exports = function(config)
{
	var cloud = {};

	cloud = require('socket.io-client')(config.url);

	cloud.on('connect', function() {
		global.Printspot.eventbus.emit('internalSuccess', {
			type: 'cloud',
			data: {
				message: 'Cloud connection initiated'
			}
		});
	});

	cloud.on('handshake', function(handshake) {

	});

	return cloud;
};