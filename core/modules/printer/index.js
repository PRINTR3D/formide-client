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

// dependencies
var spawn = require('child_process').spawn;
var fs = require('fs');
var net = require('net');

module.exports =
{
	process: null,
	printer: {},
	config: {},

	init: function(config) {
		this.config = config;

		if(config.simulated)
		{
			this.process = spawn('node', ['driversim.js'], {cwd: FormideOS.appRoot + 'core/utils', stdio: 'pipe'});
			this.process.stdout.setEncoding('utf8');
			this.process.stdout.on('exit', this.onExit);
			this.process.stdout.on('error', this.onError);
		}

		this.printer = new net.Socket();
		this.connect();
		this.printer.on('error', this.printerError.bind(this));
		this.printer.on('data', this.printerStatus.bind(this));
		this.printer.on('close', this.printerError.bind(this));

		FormideOS.manager('events').on('process.exit', this.stop.bind(this));
	},

	connect: function() {
		this.printer.destroy();
		this.printer.connect({
			port: this.config.port
		}, function() {
			FormideOS.manager('debug').log('printer connected');
		});
	},

	onExit: function(exit) {
		FormideOS.manager('debug').log(exit, true);
	},

	onError: function(error) {
		FormideOS.manager('debug').log(error, true);
	},

	stop: function(stop) {
		this.process.kill('SIGINT');
	},

	// custom functions
	printerError: function(error) {
		FormideOS.manager('debug').log(error.toString(), true);
		if (error.code == 'ECONNREFUSED' || error == false) {
			this.printer.setTimeout(2000, function() {
				this.connect();
			}.bind(this));
		}
	},

	printerStatus: function(stream) {
		try // try parsing
		{
			FormideOS.utils.parseTCPStream(stream, function(printerData) {
				FormideOS.manager('events').emit('printer.status', printerData);

				if(printerData.type == 'status') {
					this.status = printerData.data;
				}

				if(printerData.type == 'finished') {
					FormideOS.manager('db').db.Queueitem
					.find({where: {id: printerData.data.printjobID}})
					.success(function(queueitem) {
						if(queueitem != null) {
							queueitem
							.updateAttributes({status: 'finished'})
							.success(function() {
								FormideOS.manager('debug').log('removed item from queue after printing');
							});
						}
					});
				}
			});
		}
		catch(e)
		{
			FormideOS.manager('debug').log(e.toString(), true);
		}
	},

	printerControl: function(data) {
		if( data.data == undefined || data.data == null)
		{
			data.data = {};
		}

		data = JSON.stringify(data);
		FormideOS.manager('debug').log(data);
		this.printer.write(data + '\n');
	}
}