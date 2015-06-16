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
	namespace.on('connection', function(socket) {
		socket.emit('handshake', {
			id: socket.id
		});

		socket.on('typeof', function(data) {
			if(data.type == 'dashboard')
			{
				socket.emit('auth', {message: 'OK', id: socket.id});

				FormideOS.manager('events').emit('websocket.connected', {
					type: 'dashboard',
					data: {
						port: FormideOS.config.get('dashboard.port')
					}
				});

				FormideOS.manager('debug').log('Dashboard connected');
			}
		});

		// Socket disconnect
		socket.on('disconnect', function() {
			FormideOS.manager('events').emit('websocket.disconnected', {
				type: 'dashboard',
				data: {
					message: 'Dashboard disconnected'
				}
			});

			FormideOS.manager('debug').log('Dashboard disconnected');
		});

		// load channels from config
		Object.keys(module.config.dashboard).forEach(function(method) {
			(function(realMethod) {
				socket.on(realMethod, function(data) {
					var expected = FormideOS.config.get('printer.dashboard')[realMethod];
					var given = data;
					var correct = true;

					for(key in expected) {
						if(!given.hasOwnProperty(expected[key])) {
							correct = false;
						}
					}

					if(correct)
					{
						if(realMethod == 'start')
						{
							data.hash = FormideOS.appRoot + FormideOS.config.get('paths.gcode') + '/' + data.hash;
						}

						var json = {
							"type": realMethod,
							"data": data
						};

						module.printerControl(json);
					}
					else
					{
						FormideOS.manager('debug').log('Dashboard tried to send command to printer but arguments were invalid', true);
					}
				});
			})(method);
		});

		FormideOS.manager('events').on('printer.status', function(data) {
			socket.emit(data.type, data.data);
		});
	});
};