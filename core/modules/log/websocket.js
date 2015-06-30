/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(namespace, module) {
	
	namespace.on('connection', function(socket) {
		FormideOS.events.on('log.debug', function(data) {
			socket.emit('debug', data);
		});
	});
}; 