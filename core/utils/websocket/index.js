/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	Websocket server. All modules can add namespaced to it. Permissions handled automatically by
 *	FormideOS.
 */

var io = require('socket.io');
//var permissionsMiddleware 		= require('./middleware/permissions');
var ws = require("nodejs-websocket");

module.exports = {

	init: function() {

		// base websocket server to LCD display notifications and events
		var server = ws.createServer(function (conn) {
			conn.on("text", function (message) {
				try {
					var data = JSON.parse(message);
					if (data.channel === "authenticate") {
						authenticate(data.data.accessToken, function(err, accessToken) {
							if (err) console.log(err);

							conn.sendText(JSON.stringify({
								channel: "authenticate",
								data: {
									success: true,
									message: "Authentication successful!",
									notification: false
								}
							}));

							FormideOS.events.onAny(function(data) {
								data = data || {};
								data.device = "LOCAL";
								conn.sendText(JSON.stringify({
									channel: this.event,
									data: data
								}));
							});
						});
					}
				}
				catch (e) {
					FormideOS.log.error(e.message);
				}
			});

		    conn.on("close", function (code, reason) {
		        FormideOS.log("Socket disconnected: " + reason);
		    });

		    conn.on("error", function (err) {
			    // FormideOS.events.offAny(function (){});
				FormideOS.log.error(err.message);
		    });

		}).listen(3001)



		var socketio = io.listen(FormideOS.http.server);

		// emit all system events
		socketio.on('connection', function(socket) {
			socket.on('authenticate', function(data, callback) {
				authenticate(data.accessToken, function(err, accessToken) {
					if (err) {
						callback({ success: false, message: err.message });
						return socket.disconnect();
					}

					if (!accessToken) {
						callback({ success: false, message: "Access token not found. Please provide a valid access token." });
						return socket.disconnect();
					}

					FormideOS.events.onAny(function(data) {
						data = data || {};
						socket.emit(this.event, data);
					});

                    callback({
                        success: true,
                        message: 'Authentication successful'
                    });
				});
			});
		});

		function authenticate(token, callback) {
			FormideOS.db.AccessToken.findOne({ token: token }).exec(function(err, accessToken) {
				return callback(err, accessToken);
			});
		}

		return socketio;
	}
}
