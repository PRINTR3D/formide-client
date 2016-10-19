/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	Websocket server. All modules can add namespaced to it. Permissions handled automatically by
 *	FormideClient.
 */

const io   = require('socket.io');
const ws   = require('nodejs-websocket');

module.exports = {

	listeners: {},

	init: function() {

		var self = this;

		// base websocket server to LCD display notifications and events
		var server = ws.createServer(function (conn) {

			function forwardEvents(event, data) {
				data = data || {};
				data.device = "LOCAL";
				conn.sendText(JSON.stringify({
					channel: event,
					data:    data
				}));
			}

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

							FormideClient.events.onAny(forwardEvents);
						});
					}
				}
				catch (e) {
					FormideClient.log.error(e.message);
				}
			});

		    conn.on("close", function (code, reason) {
				FormideClient.events.offAny(forwardEvents);
		        FormideClient.log("Socket disconnected: " + reason);
		    });

		    conn.on("error", function (err) {
				// FormideClient.log.error(err.message);
		    });

		}).listen(3001)


		var socketio = io.listen(FormideClient.http.server);

		// emit all system events
		socketio.on('connection', function(socket) {

			function forwardSocketEvents(event, data) {
				socket.emit(event, data);
			}

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

					FormideClient.events.onAny(forwardSocketEvents);

                    callback({
                        success: true,
                        message: 'Authentication successful'
                    });
				});
			});

			socket.on('error', function (err) {
				FormideClient.log.error('Socket err', err.message);
			});

			socket.on('disconnect', function () {
				FormideClient.events.offAny(forwardSocketEvents);
				FormideClient.log('Socket disconnected');
			});
		});

		function authenticate(token, callback) {
			FormideClient.db.AccessToken.findOne({ token: token }).exec(function(err, accessToken) {
				return callback(err, accessToken);
			});
		}

		return socketio;
	}
}
