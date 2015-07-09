/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var spawn = require('child_process').spawn;
var fs = require('fs');
var net = require('net');
var SerialPort = require("serialport");
var MarlinDriver = require('./drivers/MarlinDriver');

module.exports =
{
	numberOfPorts: 0,
	printers: {},
	config: {},
	serialPorts: [
		"/dev/ttyUSB",
		"/dev/ttyACM",
		"/dev/tty.usb",
		"/dev/cu.usb",
		"/dev/cuaU",
		"/dev/rfcomm"
	],

	init: function(config) {
		this.config = config;

		if(config.simulated) {
			this.printers.push(new MarlinDriver('/dev/null'));
		}
		else {
			this.connectPrinters();
			this.watchPorts();
		}
	},
	
	watchPorts: function() {
		setInterval(function() {
			this.connectPrinters();
		}.bind(this), 2000);
	},
	
	connectPrinters: function() {
		var self = this;
		SerialPort.list( function (err, ports) {
			if (err) {
				FormideOS.debug.log(err);
				this.numberOfPorts = 0; // fix for linux!
			}
			
			// detect adding printer
			if(ports) {
				if(this.numberOfPorts < ports.length) {
					// handle adding printer
					for(var i in ports) {
						var port = ports[i];
						for(var j in self.serialPorts) {
							console.log(port);
							if(port.comName.indexOf(self.serialPorts[j]) > -1) {
								FormideOS.module('db').db.Printer.findOne({ port: port.comName }).exec(function(err, printer) {
									if (err) FormideOS.debug.log(err);
									if (!printer) {
										FormideOS.debug.log('Printer needs to be setup on port ' + port.comName);
										FormideOS.events.emit('printer.setup', { port: port.comName });
									}
									else {
										self.printers[port.comName.split("/")[2]] = new MarlinDriver(port.comName, printer.baudrate, function(portName) {
											delete self.printers[portName.split("/")[2]];
											FormideOS.events.emit('printer.disconnected', { port: portName });
											FormideOS.debug.log('Printer disconnected: ' + portName);
										});
									}
								});
							}
						}
					}
				}
				this.numberOfPorts = ports.length;
			}
		}.bind(this));
	},
	
	getPrinters: function() {
		var result = {};
		for(var i in this.printers) {
			result[i] = this.printers[i].getStatus();
		}
		return result;
	},
	
	getStatus: function(port, callback) {
		return callback(this.printers[port].getStatus());
	},

	printerControl: function(port, data, callback) {
		this.printers[port].command(data.command, data.parameters, callback);
	},
	
	gcode: function(port, gcode, callback) {
		this.printers[port].gcode(gcode, callback);	
	},
	
	startPrint: function(port, id, gcode, callback) {
		this.printers[port].startPrint(id, gcode, callback);
	},
	
	stopPrint: function(port, callback) {
		this.printers[port].stopPrint(callback);
	},
	
	pausePrint: function(port, callback) {
		this.printers[port].pausePrint(callback);
	},
	
	resumePrint: function(port, callback) {
		this.printers[port].resumePrint(callback);
	}
}