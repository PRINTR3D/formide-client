/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var Led = require('nodejs-leds');

module.exports =
{
	name: "led",
	
	led: null,

	init: function()
	{
		this.led = new Led();
	},

	on:
	{

	},
}