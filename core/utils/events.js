/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Initialize global event emitter. Uses EventEmitter 2 because of it's awesome wildcard functionality.
 */

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var server = new EventEmitter2({
	wildcard: true,
	maxListeners: 100
});
module.exports = server;