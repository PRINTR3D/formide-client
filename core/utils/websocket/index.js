/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	Websocket server. All modules can add namespaced to it. Permissions handled automatically by
 *	FormideOS.
 */

const io   = require('socket.io');
const ws   = require('nodejs-websocket');
const uuid = require('node-uuid');

module.exports = {

	listeners: {},

	init: function() {

		var self = this;

		// call all event listener functions
		FormideOS.events.onAny(function (data) {
			for (var i in self.listeners) {
				self.listeners[i].call(this, this.event, data);
			}
		});

		// base websocket server to LCD display notifications and events
		var server = ws.createServer(function (conn) {

			const callbackId = uuid.v4();

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

							FormideOS.log('new listener', callbackId);

							self.listeners[callbackId] = function(event, data) {
								data = data || {};
								data.device = "LOCAL";
								conn.sendText(JSON.stringify({
									channel: event,
									data:    data
								}));
							}
						});
					}
				}
				catch (e) {
					FormideOS.log.error(e.message);
				}
			});

		    conn.on("close", function (code, reason) {
				delete self.listeners[callbackId];
		        FormideOS.log("Socket disconnected: " + reason);
		    });

		    conn.on("error", function (err) {
			    delete self.listeners[callbackId];
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

					FormideOS.log('new listener', socket.id);

					self.listeners[socket.id] = function(event, data) {
						socket.emit(event, data);
					};

                    callback({
                        success: true,
                        message: 'Authentication successful'
                    });
				});
			});

			socket.on('error', function (err) {
				delete self.listeners[socket.id];
				FormideOS.log.error('Socket err', err.message);
			});

			socket.on('disconnect', function () {
				delete self.listeners[socket.id];
				FormideOS.log('Socket disconnected');
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
