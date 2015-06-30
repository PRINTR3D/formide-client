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
		
		FormideOS.debug.log('Dashboard connected');

		// Socket disconnect
		socket.on('disconnect', function() {
			FormideOS.events.emit('websocket.disconnected', {
				type: 'dashboard',
				data: {
					message: 'Dashboard disconnected'
				}
			});

			FormideOS.debug.log('Dashboard disconnected');
		});
		
		socket.on('command', function(data) {
			
			var method = data.method;
			var parameters = data.parameters || {};
			var port = data.port;
			
			if (method === 'start') {
				module.startPrint(port, data.parameters.hash, function() {});
			}
			else if(method == 'pause') {
				module.pausePrint(port, function() {});
			}
			else if(method == 'resume') {
				module.resumePrint(port, function() {});
			}
			else if(method == 'stop') {
				module.stopPrint(port, function() {});
			}
			else if(method == 'gcode') {
				module.gcode(port, data.parameters.code, function() {});
			}
			else {
				module.printerControl(port, { command: method, parameters: parameters }, function() {});
			}
		});

		FormideOS.events.on('printer.status', function(data) {
			socket.emit(data.type, data.data);
		});
		
		FormideOS.events.on('printer.finished', function(data) {
			socket.emit('finished', data);
		});
		
		FormideOS.events.on('printer.connected', function(data) {
			socket.emit('connected', data);
		});
		
		FormideOS.events.on('printer.disconnected', function(data) {
			socket.emit('disconnected', data);
		});
		
		FormideOS.events.on('printer.setup', function(data) {
			socket.emit('setup', data);
		});
	});
};