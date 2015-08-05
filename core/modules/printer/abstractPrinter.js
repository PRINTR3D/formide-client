/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Abstract driver for FDM 3D printers. See implementation drivers for more info.
 */


// Dependencies

function AbstractPrinter(serialPort, driver/* , disconnectCallback */) {
	this.port = serialPort;
	this.driver = driver;
// 	this.disconnectCallback = disconnectCallback;
	this.status = {};
	this.queueID = null;
	
	// ask for the status every 2 seconds
	this.statusInterval = setInterval(this.askStatus.bind(this), 2000);
	
	console.log('abstract driver init for ' + this.port);
	
	return this;
}

// fetch status async every x seconds
AbstractPrinter.prototype.askStatus = function() {
	var self = this;
	this.driver.getPrinterInfo(this.port, function(err, status) {
		FormideOS.events.emit('printer.status', status);
		self.status = status;
	});
}

// get status sync
AbstractPrinter.prototype.getStatus = function() {
	return this.status;
}

// TODO: make dynamic per firmware and type
AbstractPrinter.prototype.map = {
	"home":					["G28"],
	"home_x": 				["G28 X"],
	"home_y": 				["G28 Y"],
	"home_z": 				["G28 Z"],
	"jog":					["G91", "G21", "G1 _axis_ _dist_"],
	"jog_abs":				["G90", "G21", "X_x_ Y_y_ Z_z_"],
	"extrude":				["G91", "G21", "G1 E _dist_"],
	"retract":				["G91", "G21", "G1 E _dist_"],
	"lcd_message":			["M117                     _msg_"],
	"temp_bed":				["M140 S_temp_"],
	"temp_extruder":		["M104 S_temp_"],
	"power_on":				["M80"],
	"power_off":			["M81"],
	"stop_all":				["M112"],
	"fan_on":				["M106"],
	"fan_off":				["M107"],
	"gcode":				["_gcode_"]
};

// M17		power_on_steppers
// M18		power_off_steppers
	
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

// M119: 	Get Endstop Status

// M600:	Pause for filament change

AbstractPrinter.prototype.getCommands = function() {
	return this.map;
}

AbstractPrinter.prototype.sendRaw = function(rawCommand, callback) {
	var self = this;
	self.driver.sendGcode(rawCommand, this.port, function(err, response) {
		if (callback) return callback(response);
	});
}

AbstractPrinter.prototype.command = function(command, parameters, callback) {
	var self = this;
	var command = Object.create(this.map[command]);
	for(var i in command) {
		for(var j in parameters) {
			if (typeof parameters[j] === 'string') {
				// make sure that values like X, Y, Z and G are in upper case. some printers don't understand the lower case versions.
				parameters[j] = parameters[j].toUpperCase();
			}
			command[i] = command[i].replace("_" + j + "_", parameters[j]);
		}
		self.sendRaw(command[i]);
	}
	return callback('OK');
}

AbstractPrinter.prototype.startPrint = function(id, gcode, callback) {
	var self = this;
	FormideOS.module('db').db.Queueitem.findOne({ _id: id, gcode: gcode }, function(err, queueitem) {
		if (err) FormideOS.debug.log(err);
		if (queueitem) {
			self.driver.printFile(FormideOS.appRoot + FormideOS.config.get('paths.gcode') + '/' + gcode, id, self.port, function(err, response) {
				if (err) return FormideOS.debug.log(err);
				queueitem.status = 'printing';
				queueitem.save();
				self.queueID = id;
				FormideOS.events.emit('printer.started', {
					port: self.port,
					printjobID: self.queueID
				});
				return callback(null, response);
			});
		}
		else {
			return callback({ success: false, message: 'Queue item not found' });
		}
	});
}

AbstractPrinter.prototype.pausePrint = function(callback) {
	var self = this;
	self.driver.pausePrint(self.port, function(err, response) {
		if (err) return FormideOS.debug.log(err);
		FormideOS.events.emit('printer.paused', {
			port: self.port,
			printjobID: self.queueID
		});
		return callback(null, response);
	})
}

AbstractPrinter.prototype.resumePrint = function(callback) {
	var self = this;
	self.driver.resumePrint(self.port, function(err, response) {
		if (err) return FormideOS.debug.log(err);
		FormideOS.events.emit('printer.resumed', {
			port: self.port,
			printjobID: self.queueID
		});
		return callback(null, response);
	})
}

AbstractPrinter.prototype.stopPrint = function(done, callback) {
	var self = this;
	self.driver.stopPrint(self.port, function(err, response) {
		if (err) FormideOS.debug.log(err);
		if (response) {
			if (done) {
				FormideOS.module('db').db.Queueitem.findOne({ _id: self.queueID }, function(err, queueitem) {
					queueitem.status = 'finished';
					queueitem.save();
					FormideOS.events.emit('printer.stopped', {
						port: self.port,
						printjobID: self.queueID
					});
					self.queueID = null;
					return callback(err, "stopped printing");
				});
			}
			else {
				FormideOS.module('db').db.Queueitem.findOne({ _id: self.queueID }, function(err, queueitem) {
					queueitem.status = 'queued';
					queueitem.save();
					FormideOS.events.emit('printer.finished', {
						port: self.port,
						printjobID: self.queueID
					});
					self.queueID = null;
					return callback(err, "stopped printing");
				});
			}		
		}
	});
}

AbstractPrinter.prototype.gcode = function(command, callback) {
	this.sendRaw(command, callback);
}

module.exports = AbstractPrinter;