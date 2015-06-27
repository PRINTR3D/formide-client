/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	This file contains some utility functions like parsing a TCP stream. Need to store a loose function
 *	that is used throughout the system? Place it here!
 */

var StringDecoder 		= require('string_decoder').StringDecoder;
var buffer 				= '';

var serialNumber 		= require('serial-number');
serialNumber.preferUUID = true;

// function to parse incoming tcp stream into valid json data objects
function parseTCPStream(data, callback) {

	try {
		var chunck = JSON.parse(data);
		callback(chunck);
	}
	catch(e) {
		var prev = 0, next;

		var decoder = new StringDecoder('utf8');
		var chunck = decoder.write(data);

		while ((next = chunck.indexOf('\n', prev)) > -1) {
			buffer += chunck.substring(prev, next);

			callback(JSON.parse(buffer));

			buffer = '';
			prev = next + 1;
		}

		buffer += chunck.substring(prev);
	}
}

// function to get unique serial number of current device
function getSerialNumber(cb) {
	serialNumber(function (err, value) {
    	cb(err, value);
	});
}

module.exports = {
	parseTCPStream: parseTCPStream,
	getSerialNumber: getSerialNumber
};