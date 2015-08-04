/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(socketio, module)
{
	// set permissions needed for this websocket namespace
// 	namespace.permissions = ['printer:events', 'printer:control'];
	
	socketio.on('connection', function(socket) {

		// Socket disconnect
/*
		socket.on('disconnect', function() {
			FormideOS.events.emit('websocket.disconnected', {
				type: 'dashboard',
				data: {
					message: 'Dashboard disconnected'
				}
			});

			FormideOS.debug.log('Dashboard disconnected');
		});
*/
		
/*
		socket.on('command', function(data) {
			
			var method = data.method;
			var parameters = data.parameters || {};
			var port = data.port;
			
			if (method === 'start') {
				module.startPrint(port, data.parameters._id, data.parameters.gcode, function() {});
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
*/

		FormideOS.events.on('printer.status', function(data) {
			socket.emit('printer.status', data.data);
		});
		
		FormideOS.events.on('printer.finished', function(data) {
			socket.emit('printer.finished', {
				title: "Printer finished",
				message: data.port,
				port: data.port
			});
		});
		
		FormideOS.events.on('printer.connected', function(data) {
			socket.emit('printer.connected', {
				title: "Printer connected",
				message: data.port,
				port: data.port
			});
		});
		
		FormideOS.events.on('printer.disconnected', function(data) {
			socket.emit('printer.disconnected', {
				title: "Printer disconnected",
				message: data.port,
				port: data.port
			});
		});
		
		FormideOS.events.on('printer.setup', function(data) {
			socket.emit('printer.setup', data);
		});
	});
};