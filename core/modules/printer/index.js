/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
const AbstractPrinter = require('./abstractPrinter');

module.exports = {

	numberOfPorts: 0,
	driver: null,
	printers: {},
	config: {},

	init: function(config) {

		var self = this;
		this.config = config;

		// loaded via formide-drivers npm package and node-pre-gyp
		this.driver = require('formide-drivers');

		// start drivers
		this.driver.start(function(err, started, event) {
			if (err) {
				FormideOS.log.error('formide-drivers err: ' + err.message);
			}
			else if (started) {
				FormideOS.log('formide-drivers started successfully');
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
	},

	printerConnected: function(port) {
		var self = this;
		FormideOS.log('Printer connected: ' + port);
		FormideOS.events.emit('printer.connected', { port: port, notification: true, level: "success", title: "Printer connected", message: "A printer was connected" });
		self.printers[port.split("/")[2]] = new AbstractPrinter(port, self.driver);
	},

	printerDisconnected: function(port) {
		if (this.printers[port.split("/")[2]] !== undefined) {
			FormideOS.log('Printer disconnected: ' + port);
			FormideOS.events.emit('printer.disconnected', { port: port, notification: true, level: "warning", title: "Printer disconnected", message: "A printer was disconnected" });
			clearInterval(this.printers[port.split("/")[2]].statusInterval);
			delete this.printers[port.split("/")[2]];
		}
	},

	printerOnline: function(port) {
		FormideOS.log('Printer online: ' + port);
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
		if (this.printers[port] == undefined) return callback();
		callback(this.printers[port].getCommands());
	},

	getStatus: function(port, callback) {
		if (this.printers[port] == undefined) return callback();
		callback(this.printers[port].getStatus());
	},

	printerControl: function(port, data, callback) {
		if (this.printers[port] == undefined) return callback();
		this.printers[port].command(data.command, data.parameters, callback);
	},

	gcode: function(port, gcode, callback) {
		if (this.printers[port] == undefined) return callback();
		this.printers[port].gcode(gcode, callback);
	},

	startPrint: function(port, id, callback) {
		if (this.printers[port] == undefined) return callback();
		this.printers[port].startPrint(id, callback);
	},

	stopPrint: function(port, callback) {
		if (this.printers[port] == undefined) return callback();
		this.printers[port].stopPrint(callback);
	},

	pausePrint: function(port, callback) {
		if (this.printers[port] == undefined) return callback();
		this.printers[port].pausePrint(callback);
	},

	resumePrint: function(port, callback) {
		if (this.printers[port] == undefined) return callback();
		this.printers[port].resumePrint(callback);
	}
}
