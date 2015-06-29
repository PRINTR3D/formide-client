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
var SerialPort = require("serialport");
var MarlinDriver = require('./drivers/MarlinDriver');

module.exports =
{
	process: null,
	process2: null,
	printers: [],
	printer: {},
	config: {},

	init: function(config) {
		this.config = config;
		var self = this;
		
		SerialPort.list( function (err, ports) {
			for(var i in ports) {
				var port = ports[i];
				if(port.comName.indexOf('usbserial') > -1) {
					self.printers.push(new MarlinDriver(port.comName));
				}
			}
		});

		if(config.simulated) {
			this.process = spawn('node', ['driversim.js'], {cwd: FormideOS.appRoot + 'core/utils', stdio: 'pipe'});
			this.process.stdout.setEncoding('utf8');
			this.process.stdout.on('exit', this.onExit);
			this.process.stdout.on('error', this.onError);
		}
		else {
/*
			if(process.platform == 'darwin') {
				this.process2 = spawn('./ClientDriver', { cwd: FormideOS.appRoot + 'bin/osx/driver', stdio: 'pipe' });
				this.process = spawn('./formideOS', { cwd: FormideOS.appRoot + 'bin/osx/driver', stdio: 'pipe' });
			}
			else if(process.platform == 'linux' && process.arch == 'arm' ) {
				this.process2 = spawn('./ClientDriver', { cwd: FormideOS.appRoot + 'bin/rpi/driver', stdio: 'pipe' });
				this.process = spawn('./formideOS', { cwd: FormideOS.appRoot + 'bin/rpi/driver', stdio: 'pipe' });
			}
			
			this.process.on('close', this.printerError.bind(this));
			this.process2.on('close', this.printerError.bind(this));
*/
		}

/*
		this.printer = new net.Socket();
		this.connect();
		this.printer.on('error', this.printerError.bind(this));
		this.printer.on('data', this.printerStatus.bind(this));
		this.printer.on('close', this.printerError.bind(this));

		FormideOS.events.on('process.exit', this.stop.bind(this));
*/
	},

	connect: function() {
		this.printer.destroy();
		this.printer.connect({
			port: this.config.port
		}, function() {
			FormideOS.debug.log('printer connected');
		});
	},

	onExit: function(exit) {
		FormideOS.debug.log(exit, true);
	},

	onError: function(error) {
		FormideOS.debug.log(error, true);
	},

	stop: function(stop) {
		this.process.kill('SIGHUP');
		if(this.process2 !== null) {
			this.process2.kill('SIGHUP');
		}
	},

	// custom functions
	printerError: function(error) {
		FormideOS.debug.log(error.toString(), true);
		if (error.code == 'ECONNREFUSED' || error == false) {
			this.printer.setTimeout(2000, function() {
				this.connect();
			}.bind(this));
		}
	},

	printerStatus: function(stream) {
		try {
			FormideOS.utils.parseTCPStream(stream, function(printerData) {
				FormideOS.events.emit('printer.status', printerData);

				if(printerData.type == 'status') {
					this.status = printerData.data;
				}

				if(printerData.type == 'finished') {
					FormideOS.module('db').db.Queueitem
					.find({where: {id: printerData.data.printjobID}})
					.success(function(queueitem) {
						if(queueitem != null) {
							queueitem
							.updateAttributes({status: 'finished'})
							.success(function() {
								FormideOS.debug.log('removed item from queue after printing');
							});
						}
					});
				}
			});
		}
		catch(e) {
			FormideOS.debug.log(e.toString(), true);
		}
	},
	
	getStatus: function(callback) {
		this.printers[0].getStatus(callback);
	},

	printerControl: function(data, callback) {
		this.printers[0].command(data.command, data.parameters, callback);
		
/*
		if( data.data == undefined || data.data == null)
		{
			data.data = {};
		}

		data = JSON.stringify(data);
		FormideOS.debug.log(data);
		this.printer.write(data + '\n');
*/
	}
}