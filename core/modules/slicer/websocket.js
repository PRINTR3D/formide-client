/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(namespace, module) {
	namespace.on('connection', function(socket) {
		
		FormideOS.events.on('slicer.slice', function(data) {
			socket.emit('slice', data);
		});
		
		FormideOS.events.on('slicer.progress', function(data) {
			socket.emit('progress', data);
		});

		FormideOS.events.on('slicer.finished', function(data) {
			socket.emit('finished', data);
		});
	});
};