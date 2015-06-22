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

var io 							= require('socket.io');
var permissionsMiddleware 		= require('./middleware/permissions');

module.exports = {

	init: function() {
		
		var connection = io.listen(FormideOS.http.server);

		connection.use(function(socket, next) {
			FormideOS.http.session(socket.request, socket.request.res, next);
		});
		
		connection.use(permissionsMiddleware);
		
		return connection;
	}
}