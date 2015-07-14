/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Abstract driver for FDM 3D printers. See implementation drivers for more info.
 */


// Dependencies
var SerialPort 	= require("serialport");
var fs			= require("fs");

function AbstractDriver(serialPort, options) {
	
	// SerialPort instance
	this.serialComm = null;
	
	// status of the serial port
	this.open = false;
	
	// function to call when serial connection is opened
	this.onOpenCallback = options.onOpenCallback || function() {};
	
	// function to call when serial connection closes (unexpectedly?)
	this.onCloseCallback = options.onCloseCallback || function() {};
	
	// baudrate of the printer, most printers use 250k, defaulting to that
	this.baudrate = options.baudrate || 250000;
	
	// serial port that printer is connected to
	this.port = serialPort;
	
	// save printer axis matrix (some printers flip x/y axis)
	this.matrix = null;
	
	// status of the printer comm
	this.status = 'connecting';
	
	// how often to get the printer status in millis
	this.statusInterval = options.statusInterval || 2000;
	
	// function to call on statusInterval
	this.statusIntervalFunction = null;
	
	// array to keep track of extruder temps
	this.extruders = [];
	
	// object to keep track of bed temp
	this.bed = {};
	
	// time since starting print
	this.time = 0;
	
	// time since starting print
	this.timeStarted = 0;
	
	// ID of queue item that's currently printing
	this.queueID = null;
	
	// array of gcode lines to send
	this.gcodeBufferArray = [];
	
	// index of current line
	this.currentLine = 0;
	
	// call connect function
	this.connect();
	
	// return object
	return this;
}

AbstractDriver.prototype.connect = function() {
	
	// create a new instance of SerialPort.SerialPort with correct port, baudrate and parser
	this.serialComm = new SerialPort.SerialPort(this.port, {
		baudrate: this.baudrate,
		parser: SerialPort.parsers.readline("\n")
	});
	
	// when printer connected
	this.serialComm.on('open', function() {
		this.onOpenCallback(this.port);
		this.open = true;
		this.status = 'online';
		this.serialComm.on('data', this.receivedData.bind(this));
		this.statusIntervalFunction = setInterval(this.askStatus.bind(this), this.statusInterval);
	}.bind(this));
	
	this.serialComm.on('error', function(err) {
		
	});
	
	this.serialComm.on('close', function() {
		this.onCloseCallback(this.port);
		clearInterval(this.statusIntervalFunction);
		this.open = false;
		this.status = 'offline';
	});
}

AbstractDriver.prototype.gcodeMap = function(command) {
	throw "gcodeMap needs to be implemented in extended driver function!"
}

AbstractDriver.prototype.getStatus = function() {
	
	this.sendRaw("M105", function() {});
	FormideOS.events.emit('printer.status', { type: 'status', data: this.getStatus() });
}

AbstractDriver.prototype.sendRaw = function() {
	
}

AbstractDriver.prototype.sendLineToPrint = function() {
	
}

AbstractDriver.prototype.receivedData = function(data) {
	
}