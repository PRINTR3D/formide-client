/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	Abstract driver for FDM 3D printers. See implementation drivers for more info.
 */

const path = require('path');
const fs   = require('fs');

function AbstractPrinter(serialPort, driver) {
	this.port = serialPort;
	this.driver = driver;
	this.status = {};
	this.queueItemId = null;

	// ask for the status every 2 seconds
	this.statusInterval = setInterval(this.askStatus.bind(this), 2000);

	return this;
}

/*
 * Ask the driver every 2 seconds for the status (temperatures, status, progress)
 */
AbstractPrinter.prototype.askStatus = function() {
	var self = this;
	this.driver.getPrinterInfo(this.port, function(err, status) {
		FormideOS.events.emit('printer.status', status);
		self.status = status;
	});
}

/*
 * Get current status
 */
AbstractPrinter.prototype.getStatus = function() {
	return this.status;
}

/*
 * Available commands mapped to gcodes
 * TODO: make dynamic to support more printer firmwares
 * TODO: find out how to send toolhead switch in same command as extrude/retract to prevent delay
 */
AbstractPrinter.prototype.map = {
	'home':					['G28'],
	'home_x': 				['G28 X'],
	'home_y': 				['G28 Y'],
	'home_z': 				['G28 Z'],
	'jog':					['G91', 'G21', 'G1 _axis_ _dist_'],
	'extrude':				['T_extnr_ ', 'G91', 'G21', 'G1 E _dist_'],
	'retract':				['T_extnr_ ', 'G91', 'G21', 'G1 E _dist_'],
	'lcd_message':			['M117                     _msg_'],
	'temp_bed':				['M140 S_temp_'],
	'temp_extruder':		['T_extnr_', 'M104 S_temp_'],
	'power_on':				['M80'],
	'power_off':			['M81'],
	'stop_all':				['M112'],
	'fan_on':				['M106'],
	'fan_off':				['M107'],
	'gcode':				['_gcode_']
};

/*
 * Get list of available commands
 */
AbstractPrinter.prototype.getCommands = function() {
	return this.map;
}

/**
 * Send raw data to printer
 */
AbstractPrinter.prototype.sendRaw = function(rawCommand, callback) {
	this.driver.sendGcode(rawCommand, this.port, function(err, response) {
		if (callback) return callback(null, response);
	});
}

/**
 * Send raw tune data to printer
 */
AbstractPrinter.prototype.sendRawTune = function (rawCommand, callback) {
	this.driver.sendTuneGcode(rawCommand, this.port, function(err, response) {
		if (callback) return callback(null, response);
	});
}

/**
 * Send command to printer (parsed with the map array)
 */
AbstractPrinter.prototype.command = function(command, parameters, callback) {
	var self = this;
	var command = Object.create(this.map[command]);
	for(var i in command) {
		for(var j in parameters) {
			if (typeof parameters[j] === 'string') {
				// make sure that values like X, Y, Z and G are in upper case. some printers don't understand the lower case versions.
				parameters[j] = parameters[j].toUpperCase();
			}
			command[i] = command[i].replace('_' + j + '_', parameters[j]);
		}
		self.sendRaw(command[i]);
	}
	return callback(null, 'OK');
}

/**
 * Start printing. id is queueItem id and gcode is the filename in the file system.
 * Searches for queue item in database and sends absolute file path to driver
 */
AbstractPrinter.prototype.startPrint = function(queueItemId, callback) {
	var self = this;
	// first we set all current printing db queue items for this port back to queued to prevent multiple 'printing' items
	FormideOS.db.QueueItem
	.update({ port: self.port }, { status: 'queued' })
	.exec(function(err, updated) {
		if (err) return callback(err);
		FormideOS.db.QueueItem
		.findOne({ id: queueItemId })
		.exec(function(err, queueItem) {
			if (err) return callback(err);
			if (!queueItem) return callback(null, null);
			var filePath = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.gcode'), queueItem.gcode);
			self.driver.printFile(filePath, queueItem.id, self.port, function(err, response) {
				if (err) return callback(err);
				FormideOS.db.QueueItem
				.update({ id: queueItem.id }, {
					status: 'printing'
				}, function(err, updated) {
					if (err) return callback(err);
					self.queueItemId = queueItemId;
					FormideOS.events.emit('printer.started', {
						port:		 self.port,
						queueItemId: self.queueItemId
					});
					return callback(null, true);
				});
			});
		});
	});
}

/*
 * Pause printing the current file
 */
AbstractPrinter.prototype.pausePrint = function(callback) {
	var self = this;
	self.driver.pausePrint(self.port, function(err, response) {
		if (err) return callback(err);
		FormideOS.events.emit('printer.paused', {
			port:		 self.port,
			queueItemId: self.queueItemId
		});
		return callback(null, response);
	});
}

/*
 * Resume printing the current file
 */
AbstractPrinter.prototype.resumePrint = function(callback) {
	var self = this;
	self.driver.resumePrint(self.port, function(err, response) {
		if (err) return callback(err);
		FormideOS.events.emit('printer.resumed', {
			port:		 self.port,
			queueItemId: self.queueItemId
		});
		return callback(null, response);
	});
}

/*
 * Stop printing the current file. Specify done parameter to indicate if print is finished or not
 */
AbstractPrinter.prototype.stopPrint = function(callback) {
	var self = this;
	// TODO: implement custom stop gcode array (2nd param)
	self.driver.stopPrint(self.port, '', function(err, response) {
		if (err) return FormideOS.log.error(err.message);
		FormideOS.db.QueueItem.findOne({ id: self.queueItemId }, function(err, queueItem) {
			if (err) return FormideOS.log.error(err.message);
			if (!queueItem) return FormideOS.log.warn('No queue item with that ID found to stop printing');
			queueItem.status = 'queued';
			queueItem.save();
			FormideOS.events.emit('printer.stopped', {
				port: self.port,
				queueItemId: self.queueItemId
			});
			self.queueItemId = null;
			return callback(err, 'stopped printing');
		});
	});
}

/*
 * Handle print finished event. Set queue item to finished and emit event to dashboards
 */
AbstractPrinter.prototype.printFinished = function(queueItemId) {
	var self = this;
	if (queueItemId !== self.queueItemId) FormideOS.log.warn('Warning: driver queue ID and client queue ID are not the same!', true);
	FormideOS.db.QueueItem
	.findOne({ id: self.queueItemId }, function(err, queueItem) {

		self.queueItemId = null;
		FormideOS.events.emit('printer.finished', {
			port:		 self.port,
			queueItemId: self.queueItemId
		});

		// remove gcode from cloud
		if (queueItem.origin === 'cloud') {
			const gcodePath = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.gcode'), queueItem.gcode);
			fs.unlinkSync(gcodePath);
		}

		if (err) return FormideOS.log.err(err);
		if (!queueItem) return FormideOS.log.warn('No queue item with that ID found to handle finished printing');
		queueItem.status = 'finished';
		queueItem.save();
	});
}

/**
 * Send a custom gcode to the printer (raw)
 */
AbstractPrinter.prototype.gcode = function (command, callback) {
	this.sendRaw(command, callback);
}

/**
 * Send tune command to printer (insert gcode commands while printing)
 */
AbstractPrinter.prototype.tune = function (command, callback) {
	this.sendRawTune(command, callback);
}

module.exports = AbstractPrinter;
