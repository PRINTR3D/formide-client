/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Websocket server. All modules can add namespaced to it. Permissions handled automatically by
 *	FormideOS.
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