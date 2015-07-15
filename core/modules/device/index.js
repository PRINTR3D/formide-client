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

	getCpus: function() {
		return this.device.os.cpus();
	},

	getNetwork: function() {
		return this.device.os.networkInterfaces();
	},

	getHostname: function() {
		return this.device.os.hostname();
	},

	getUpdate: function() {
		return this.device.os.uptime();
	},

	getMemory: function() {
		return {total: this.device.os.totalmem(), free: this.device.os.freemem()};
	}
};