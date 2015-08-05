/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var os = require('os');

module.exports =
{
	device: {},

	setup: function() {
		
	},

	init: function() {
		this.device.os = os;
	},

	// get info about cpu
	getCpus: function() {
		return this.device.os.cpus();
	},

	// get network interfaces
	getNetwork: function() {
		return this.device.os.networkInterfaces();
	},

	// get device hostname
	getHostname: function() {
		return this.device.os.hostname();
	},

	// get info about uptime
	getUptime: function() {
		return this.device.os.uptime();
	},

	// get info about memory usage
	getMemory: function() {
		return {total: this.device.os.totalmem(), free: this.device.os.freemem()};
	}
};