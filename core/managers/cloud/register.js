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

// setup new cloud connection
var cloudConfig = {
	url: 'http://ws.formide.com:4000',
	softMac: 'AAABBBCCCDDD'
};
var cloud = require('./cloud.js')(cloudConfig);

// register cloud in printspot
global.Printspot.register('cloud', cloud);