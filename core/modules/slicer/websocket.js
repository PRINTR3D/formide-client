/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(socketio, module)
{	
	// set permissions needed for this websocket namespace
	// namespace.permissions = ['slicer:events'];
	
	socketio.on('connection', function(socket) {
		
		FormideOS.events.on('slicer.slice', function(data) {
			socket.emit('slicer.slice', {
				title: "Slicer started",
				message: data.message
			});
		});
		
		FormideOS.events.on('slicer.progress', function(data) {
			socket.emit('progress', data);
		});

		FormideOS.events.on('slicer.finished', function(data) {
			socket.emit('slicer.finished', {
				title: "Slicer finished",
				message: data.message
			});
		});
		
		FormideOS.events.on('slicer.failed', function(data) {
			socket.emit('slicer.failed', {
				title: "Slicer error " + data.status,
				message: data.message
			});
		});
	});
};