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

var os = require('os');

module.exports =
{
	device: {},

	init: function()
	{
		this.device.os = os;
	},

	getCpus: function()
	{
		return this.device.os.cpus();
	},

	getNetwork: function()
	{
		return this.device.os.networkInterfaces();
	},

	getHostname: function()
	{
		return this.device.os.hostname();
	},

	getUpdate: function()
	{
		return this.device.os.uptime();
	},

	getMemory: function()
	{
		return {total: this.device.os.totalmem(), free: this.device.os.freemem()};
	}
};