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
 
// TODO: more drivers than just marlin

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
		"/dev/cu.usbserial",
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
			if (err) FormideOS.debug.log(err);
			// detect adding printer
			if(ports) {
				if(this.numberOfPorts < ports.length) {
					// handle adding printer
					for(var i in ports) {
						var port = ports[i];
						for(var j in self.serialPorts) {
							if(port.comName.indexOf(self.serialPorts[j]) > -1) {
								FormideOS.module('db').db.Printer.findOne({ port: port.comName }).exec(function(err, printer) {
									if (err) FormideOS.debug.log(err);
									if (!printer) {
										FormideOS.debug.log('Printer needs to be setup on port ' + port.comName);
										FormideOS.events.emit('printer.setup', { port: port.comName });
									}
									else {
										self.printers[port.comName.split("/")[2]] = new MarlinDriver(port.comName, printer.baudrate, function() {
											delete self.printers[port.comName.split("/")[2]];
											FormideOS.events.emit('printer.disconnected');
											FormideOS.debug.log('Printer disconnected');
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
	
	startPrint: function(port, hash, callback) {
		this.printers[port].startPrint(hash, callback);	
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