/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var captainsLog 	= require('captains-log');
var winston 		= require('winston');
var Transport		= require('winston/lib/winston/transports/transport').Transport;
var util 			= require('util');
var events 			= require('events');

// custom winston transport to get events to websockets
var EventTransport = function (options) {
	Transport.call(this, options);
	options = options || {};
}

util.inherits(EventTransport, Transport);

EventTransport.prototype.name = 'event';

EventTransport.prototype.log = function (level, msg, meta, callback) {
	FormideClient.events.emit('log.' + level, { message: msg });
	this.emit('logged');
	callback(null, true);
}

var customLogger = new winston.Logger({
	transports: [
		new (winston.transports.Console)({ level: 'silly' }),
		new (EventTransport)({ level: 'silly' })
	]
});

module.exports = captainsLog({
	custom: customLogger
});