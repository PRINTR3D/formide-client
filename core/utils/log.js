/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Neat console debugging with colors, formatting and timestamps. We're not entirely happy with it,
 *	so feel free to make it better!
 */

var log 		= require('captains-log')();

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

module.exports = {
	
	modules: {},
	
	log: log
}