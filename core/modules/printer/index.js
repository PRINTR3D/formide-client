/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var AbstractPrinter = require('./abstractPrinter');

module.exports =
{
	numberOfPorts: 0,
	driver: null,
	printers: {},
	config: {},

	init: function(config) {
		
		var self = this;
		
		this.config = config;

		if(process.platform == 'darwin') {
			this.driver	= require(FormideOS.appRoot + 'bin/osx/Formidriver');
			FormideOS.debug.log('Binded Formidriver in osx/Formidriver');
		}
		else if(process.platform == 'linux') {
			this.driver	= require(FormideOS.appRoot + 'bin/rpi/Formidriver');
			FormideOS.debug.log('Binded Formidriver in rpi/Formidriver');
		}
		
		if(this.driver !== null) {
			this.driver.start(function(err, started, event) {
				
				if (err) {
					FormideOS.debug.log('Formidriver err: ' + err);
				}
				
				else if (started) {
					FormideOS.debug.log('Formidriver started successfully');
				}
				
				else if (event) {
					// an event came back which we can use to do sometehing with!
					
					if (event.type === 'printerConnected') {
						self.printerConnected(event.port);
					}
					else if (event.type === 'printerDisconnected') {
						self.printerDisconnected(event.port);
					}
					else if (event.type === 'printerOnline') {
						self.printerOnline(event.port);
					}
					else if (event.type === 'printFinished') {
						self.printFinished(event.port, event.printjobID);
					}
				}
				
			});
		}
		else {
			FormideOS.debug.log("Your system is not compatible with one of our driver binaries", true);
		}
	},
	
	printerConnected: function(port) {
		var self = this;
		FormideOS.module('db').db.Printer.findOne({ port: port }).exec(function(err, printer) {
			if (err) FormideOS.debug.log(err);
			if (!printer) {
				FormideOS.debug.log('Printer needs to be setup: ' + port);
				FormideOS.events.emit('printer.setup', { port: port });
			}
			else {
				FormideOS.debug.log('Printer connected: ' + port);
				FormideOS.events.emit('printer.connected', { port: port });
				self.printers[port.split("/")[2]] = new AbstractPrinter(port, self.driver);
			}
		});
	},
	
	printerDisconnected: function(port) {
		if (this.printers[port.split("/")[2]] !== undefined) {
			FormideOS.debug.log('Printer disconnected: ' + port);
			FormideOS.events.emit('printer.disconnected', { port: port });
			delete this.printers[port.split("/")[2]];
		}
	},
	
	printerOnline: function(port) {
		FormideOS.debug.log('Printer online: ' + port);
		FormideOS.events.emit('printer.online', { port: port });
	},
	
	printFinished: function(port, printjobId) {
		if (this.printers[port.split("/")[2]] !== undefined) {
			this.printers[port.split("/")[2]].printFinished(printjobId);
		}
	},
	
	getPrinters: function() {
		var result = {};
		for(var i in this.printers) {
			result[i] = this.printers[i].getStatus();
		}
		return result;
	},
	
	getCommands: function(port, callback) {
		if (this.printers[port] !== undefined) {
			return callback(this.printers[port].getCommands());
		}	
	},
	
	getStatus: function(port, callback) {
		if (this.printers[port] !== undefined) {
			return callback(this.printers[port].getStatus());
		}
	},

	printerControl: function(port, data, callback) {
		if (this.printers[port] !== undefined) {
			this.printers[port].command(data.command, data.parameters, callback);
		}
		else {
			return callback({ success: false, message: 'No printer on connected on this port' });
		}
	},
	
	gcode: function(port, gcode, callback) {
		if (this.printers[port] !== undefined) {
			this.printers[port].gcode(gcode, callback);	
		}
		else {
			return callback({ success: false, message: 'No printer on connected on this port' });
		}
	},
	
	startPrint: function(port, id, gcode, callback) {
		if (this.printers[port] !== undefined) {
			this.printers[port].startPrint(id, gcode, callback);
		}
		else {
			return callback({ success: false, message: 'No printer on connected on this port' });
		}
	},
	
	stopPrint: function(port, callback) {
		if (this.printers[port] !== undefined) {
			this.printers[port].stopPrint(callback);
		}
		else {
			return callback({ success: false, message: 'No printer on connected on this port' });
		}
	},
	
	pausePrint: function(port, callback) {
		if (this.printers[port] !== undefined) {
			this.printers[port].pausePrint(callback);
		}
		else {
			return callback({ success: false, message: 'No printer on connected on this port' });
		}
	},
	
	resumePrint: function(port, callback) {
		if (this.printers[port] !== undefined) {
			this.printers[port].resumePrint(callback);
		}
		else {
			return callback({ success: false, message: 'No printer on connected on this port' });
		}
	}
}