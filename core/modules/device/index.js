/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var os = require('os');

module.exports =
{
	name: "device",
	
	device: {},

	init: function()
	{
		this.device.os = os;
	},

	getInfo: function()
	{
		var config = {
			environment: FormideOS.config.environment,
			ports: {
				app: FormideOS.config.get('app.port'),
				client: FormideOS.config.get('printer.port'),
				slicer: FormideOS.config.get('slicer.port'),
				interface: FormideOS.config.get('dashboard.port')
			},
			debug: FormideOS.config.get('app.debug'),
			cloud: {
				url: FormideOS.config.get('cloud.url')
			},
			mac: FormideOS.macAddress
		}

		return config;
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