/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	This is the printer driver for Marlin and Repetier firmware. Tested with Felix, Ultimaker, Builder and 
 *	Cyrus 3D printers. Feel free to add more functionality like SD card support. Also, we want some extra
 *	drivers for other firmwares. For that, an abstract driver function needs to be made that we can use to
 *	implement other drivers with the same functions.
 */

var SerialPort 	= require("serialport");
var fs			= require("fs");
var readline 	= require('readline');

function PrinterDriver(port, baudrate, onCloseCallback) {
	
	this.open = false;
	this.onCloseCallback = onCloseCallback;
	this.baudrate = baudrate;
	
	this.port = port;
	this.matrix = null;
	
	this.status = 'connecting';
	
	this.extruders = [];
	this.bed = {};
	
	this.time = 0;
	this.queueID = null;
	
	this.messageBuffer = [];
	
	this.gcodeBuffer = [];
	this.currentLine = 0;
	
	this.timeStarted = null;

	this.connect();
	
	return this;
}

PrinterDriver.prototype.connect = function() {
	var sPort = SerialPort.SerialPort;
	this.sp = new sPort(this.port, {
		baudrate: this.baudrate,
		parser: SerialPort.parsers.readline("\n")
	});
	
	this.sp.on('open', function() {
		FormideOS.debug.log("Printer connected " + this.port);
		FormideOS.events.emit('printer.connected', { port: this.port });
		
		this.open = true;
		this.status = 'online';
		this.sp.on('data', this.received.bind(this));
		
		setInterval(this.askStatus.bind(this), 2000);
	}.bind(this));
	
	this.sp.on('error', function(err) {
		FormideOS.debug.log('printer error: ', err);
	});
	
	this.sp.on('close', function() {
		this.open = false;
		this.onCloseCallback();
	}.bind(this));
};

PrinterDriver.prototype.map = {
	"home":					["G28"],
	"home_x": 				["G28 x"],
	"home_y": 				["G28 y"],
	"home_z": 				["G28 z"],
	"jog":					["G91", "G21", "G1 _axis_ _dist_"],
	"jog_abs":				["G90", "G21", "X_x_ Y_y_ Z_z_"],
	"extrude":				["G91", "G21", "G1 E _dist_"],
	"retract":				["G91", "G21", "G1 E _dist_"],
	"lcd_message":			["M117                     _msg_"],
	"temp_bed":				["M140 S_temp_"],
	"temp_extruder":		["M104 S_temp_"],
	"power_on":				["M80"],
	"power_off":			["M81"],
	"power_on_steppers":	["M17"],
	"power_off_steppers":	["M18"],
	"stop_all":				["M112"]
};

// M20: 	List SD card
// M21: 	Initialize SD card
// M22: 	Release SD card
// M23: 	Select SD file
// M24: 	Start/resume SD print
// M25:		pause SD print
// M27:		Report SD print status
// M28: 	Begin write to SD card
// M29: 	Stop writing to SD card
// M30: 	Delete a file on the SD card

// M106: 	Fan On
// M107: 	Fan Off

// M119: 	Get Endstop Status

// M600:	Pause for filament change

PrinterDriver.prototype.askStatus = function() {	
	this.sendRaw("M105", function() {});
	FormideOS.events.emit('printer.status', { type: 'status', data: this.getStatus() });
};

PrinterDriver.prototype.getStatus = function() {
	return {
		status: this.status,
		bed: this.bed,
		extruders: this.extruders,
		timeStarted: this.timeStarted,
		timeNow: new Date(),
		totalLines: this.gcodeBuffer.length,
		currentLine: this.currentLine,
		progress: (this.currentLine / this.gcodeBuffer.length) * 100,
		port: this.port,
		queueitemID: this.queueID
	};
};

PrinterDriver.prototype.command = function(command, parameters, callback) {
	console.log(command, parameters);
	if (this.status === 'online') {
		var command = Object.create(this.map[command]);
		for(var i in command) {
			for(var j in parameters) {
				command[i] = command[i].replace("_" + j + "_", parameters[j]);
			}
			this.sendRaw(command[i], callback);
		}
	}
};

PrinterDriver.prototype.sendRaw = function(data, callback) {
	if(this.open) {
		this.sp.write(data + "\n", callback);
	}
};

PrinterDriver.prototype.sendLineToPrint = function() {
	setTimeout(function() {
        if (this.status === 'printing') {
	        this.sendRaw(this.gcodeBuffer[this.currentLine]);
	        if(this.currentLine < this.gcodeBuffer.length) {
	        	this.currentLine++;
	        }
	        else {
		        this.stopPrint(function(err, result) {
			    	FormideOS.events.emit('printer.finished', { port: this.port });
		        }, true);
	        }
        }
    }.bind(this), 50);
};

PrinterDriver.prototype.parseGcode = function(fileContents, callback) {
	gcodeData = fileContents.split('\n');
	var parsedGcodeData = [];
	var lineCount = 0;
	while(lineCount < gcodeData.length) {
		var parsedLine = gcodeData[lineCount].split(";")[0];
		if (parsedLine.length > 1) {
			parsedGcodeData.push(parsedLine);
		}
		lineCount++;
	}
	this.gcodeBuffer = parsedGcodeData;
	callback();
};

PrinterDriver.prototype.startPrint = function(id, gcode, callback) {
	var self = this;
	if (self.status === 'online') {
		FormideOS.module('db').db.Queueitem.findOne({ _id: id, gcode: gcode }, function(err, queueitem) {
			if (err) FormideOS.debug.log(err);
			if (queueitem) {
				queueitem.status = 'printing';
				queueitem.save();
				fs.readFile(FormideOS.appRoot + FormideOS.config.get('paths.gcode') + '/' + gcode, 'utf8', function(err, gcodeData) {
					if (err) return callback(err);
					self.parseGcode(gcodeData, function() {
						self.status = 'printing';
						self.queueID = id;
						self.timeStarted = new Date();
						return callback(null, "started printing " + gcode);
					});
				});
			}
			else {
				return callback('queue item not found');
			}
		});
	}
};

PrinterDriver.prototype.pausePrint = function(callback) {
	if (this.status === 'printing') {
		this.status = 'paused';
		return callback(null, "paused printing");
	}
};

PrinterDriver.prototype.resumePrint = function(callback) {
	if (this.status === 'paused') {
		this.status = 'printing';
		return callback(null, "resume printing");
	}
};

PrinterDriver.prototype.stopPrint = function(callback, done) {
	var self = this;
	if (self.status === 'printing') {
		if (done) {
			FormideOS.module('db').db.Queueitem.findOne({ _id: self.queueID }, function(err, queueitem) {
				queueitem.status = 'finished';
				queueitem.save();
				self.status = 'online';
				self.currentLine = 0;
				self.queueID = null;
				self.gcodeBuffer = [];
				self.timeStarted = null;
				return callback(err, "stopped printing");
			});
		}
		else {
			FormideOS.module('db').db.Queueitem.findOne({ _id: self.queueID }, function(err, queueitem) {
				queueitem.status = 'queued';
				queueitem.save();
				self.status = 'online';
				self.currentLine = 0;
				self.queueID = null;
				self.gcodeBuffer = [];
				self.timeStarted = null;
				return callback(err, "stopped printing");
			});
		}
	}
};

PrinterDriver.prototype.gcode = function(callback) {
	if (this.status === 'online') {
		this.sendRaw(gcode, callback);
	}
};

PrinterDriver.prototype.received = function(data) {
	
	if (data.indexOf("Transformation matrix") > -1) {
		// handle Transformation matrix info
	}
	
	if (data.indexOf("start") > -1) {
		this.sendLineToPrint();
	}
	
	if (data.indexOf("ok") > -1 || data.indexOf("OK") > -1) {
		this.sendLineToPrint();
	}
	
	if (data.indexOf("wait") > -1) {
		
	}
	
	if (data.indexOf("SD card inserted") > -1) {
		FormideOS.events.emit('printer.status', { type: 'sdcard_inserted', data: {port: this.port} });
	}
	
	if (data.indexOf("SD card removed") > -1) {
		FormideOS.events.emit('printer.status', { type: 'sdcard_removed', data: {port: this.port} });
	}
	
	if (data.indexOf("T:") > -1 || data.indexOf("T0:") > -1) {
		// do a try since we try to parse a lot of things that might go wrong here
		try {
			var tempArray = data.split(" ");
			var extruders = [];
			var bed = {
				temp: 0,
				targetTemp: 0
			};
			
			for(var i = 0; i < tempArray.length; i++) {
				var tempArrayItem = tempArray[i];
				if(tempArrayItem.indexOf("T") > -1 && tempArrayItem.indexOf("@") == -1) { // handle extruder temp
					var lastChar = tempArrayItem.slice(-1);
					if (lastChar == ":") { // handle temp in next array item
						extruders.push({
							id: tempArrayItem,
							temp: parseFloat(tempArray[i+1]),
							targetTemp: parseFloat(tempArray[i+2].replace('/', ''))
						});
					}
					else { // handle temp in current array item
						var iNew = tempArrayItem.split(":");
						extruders.push({
							id: iNew[0],
							temp: parseFloat(iNew[1]),
							targetTemp: parseFloat(tempArray[i+1].replace('/', ''))
						});
					}
				}
				else if(tempArrayItem.indexOf("B") > -1 && tempArrayItem.indexOf("@") == -1) { // handle bed temp
					var lastChar = tempArrayItem.slice(-1);
					if (lastChar == ":") { // handle temp in next array item
						bed = {
							temp: parseFloat(tempArray[i+1]),
							targetTemp: parseFloat(tempArray[i+2].replace('/', ''))
						};
					}
					else { // handle temp in current array item
						var iNew = tempArrayItem.split(":");
						bed = {
							temp: parseFloat(iNew[1]),
							targetTemp: parseFloat(tempArray[i+1].replace('/', ''))
						};
					}
				}
			}
			
			this.extruders = extruders;
			this.bed = bed;
		}
		catch(e) {}
	}
	
	if (data.indexOf("Fanspeed") > -1) {
		FormideOS.events.emit('printer.status', { type: 'fanspeed_changed', data: {port: this.port, speed: ''} });
	}
	
	if (data.indexOf("Info") > -1) {
		FormideOS.events.emit('printer.status', { type: 'info', data: {port: this.port, message: ''} });
	}
	
	if (data.indexOf("Target") > -1) {
		// handle target temp info
	}
	
	// this.messageBuffer.push(data); // clogs memory!
};

PrinterDriver.prototype.getMessageBuffer = function() {
	return this.messageBuffer;	
};

module.exports = PrinterDriver;