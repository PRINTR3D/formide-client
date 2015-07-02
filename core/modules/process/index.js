/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
var argv 		= require('minimist');

module.exports = {
	
	process: null,
	args: null,

	init: function()
	{
		this.process = process;
		this.args = argv(this.process.argv.slice(2));
		this.process.on('exit', this.processExit);
		this.process.on('uncaughtException', this.processError);
	},

	getProcess: function()
	{
		return this.process;
	},

	getVersion: function()
	{
		return this.process.version;
	},

	getEnvironment: function()
	{
		return this.process.env;
	},

	getId: function()
	{
		return this.process.pid;
	},

	getImpact: function()
	{
		return this.process.memoryUsage();
	},

	getUptime: function()
	{
		return this.process.uptime();
	},

	processExit: function(err)
	{
		FormideOS.events.emit('process.exit');
	},

	processError: function(err)
	{
		FormideOS.events.emit('log.error', {message: 'uncaught exception occured', data: err.stack});
		FormideOS.debug.log(err.stack);
	}
};