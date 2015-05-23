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

var StringDecoder 	= require('string_decoder').StringDecoder;
var buffer 			= '';

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
};

module.exports = {
	parseTCPStream: parseTCPStream
};