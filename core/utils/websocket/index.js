/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Websocket server. All modules can add namespaced to it. Permissions handled automatically by
 *	FormideOS.
 */

var io 							= require('socket.io');
//var permissionsMiddleware 		= require('./middleware/permissions');

module.exports = {

	init: function() {
		
		var socketio = io.listen(FormideOS.http.server);
		
		// emit all system events
		socketio.on('connection', function(socket) {
			socket.on('authenticate', function(data, callback) {
				FormideOS.module('db').db.AccessToken.findOne({ token: data.accessToken }).exec(function(err, accessToken) {
					if (err) {
						callback({ success: false, message: err.message });
						return socket.disconnect();
					}
					
					if (!accessToken) {
						callback({ success: false, message: "Access token not found. Please provide a valid access token." });
						return socket.disconnect();
					}
					
					FormideOS.events.onAny(function(data) {
						data.device = "LOCAL";
						socket.emit(this.event, data);
					});
				});
			});
		});
		
		return socketio;
	}
}