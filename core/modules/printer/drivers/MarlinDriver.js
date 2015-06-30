var SerialPort 	= require("serialport");
var fs			= require("fs");
var readline 	= require('readline');

function PrinterDriver(port) {
	
	this.statusInterval = 2000;
	
	this.port = port;
	this.matrix = null;
	
	this.status = 'connecting';
	
	this.extruders = [
		{
			id: 0,
			temp: 200,
			target: 210
		}	
	];
	
	this.bed = {
		temp: 0,
		target: 0
	};
	
	this.time = 0;
	this.timeLeft = 0;
	
	this.messageBuffer = [];
	
	this.gcodeBuffer = [];
	this.currentLine = 0;
	
	this.timeStarted = null;
		
	var sPort = SerialPort.SerialPort;
	this.sp = new sPort(this.port, {
		baudrate: 250000,
		parser: SerialPort.parsers.readline("\n")
	});
	
	this.sp.on('open', function() {
		this.status = 'online';
		this.sp.on('data', this.received.bind(this));
		setInterval(this.askStatus.bind(this), 2000);
	}.bind(this));
	
	return this;
}

PrinterDriver.prototype.map = {
	"home":					"G28",
	"home_x": 				"G28 x",
	"home_y": 				"G28 y",
	"home_z": 				"G28 z",
	"jog":					"G91 G21 G1 _axis_ _dist_",
	"jog_abs":				"G90 G21 X_x_ Y_y_ Z_z_",
	"extrude":				"G21 G1 E _dist_",
	"retract":				"G21 G1 E -_dist_",
	"lcd_message":			"M117                     _msg_",
	"bed_temp":				"M140 S_temp_",
	"ext_temp":				"M104 S_temp_",
	"power_on":				"M80",
	"power_off":			"M81",
	"power_on_steppers":	"M17",
	"power_off_steppers":	"M18",
	"stop_all":				"M112"
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
	this.sp.write("M105" + "\n");
};

PrinterDriver.prototype.getStatus = function() {
	return {
		status: this.status,
		bed: this.bed,
		extruders: this.extruders,
		timeStarted: this.timeStarted,
		totalLines: this.gcodeBuffer.length,
		currentLine: this.currentLine,
		progress: (this.currentLine / this.gcodeBuffer.length) * 100,
		port: this.port
	};
};

PrinterDriver.prototype.command = function(command, parameters, callback) {
	var command = this.map[command];
	
	for(var i in parameters) {
		command = command.replace("_" + i + "_", parameters[i]);
	}
	
	this.sendRaw(command, function(err, results) {
		callback(err, results);
	});
};

PrinterDriver.prototype.sendRaw = function(data, callback) {
	this.sp.write(data + "\n", callback);
};

PrinterDriver.prototype.sendLineToPrint = function() {
	setTimeout(function() {
        if (this.status === 'printing') {
	        this.sendRaw(this.gcodeBuffer[this.currentLine]);
	        this.currentLine++;
        }
    }.bind(this), 100); // TODO: fiddle around with interval	
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

PrinterDriver.prototype.startPrint = function(hash, callback) {
	fs.readFile(FormideOS.appRoot + FormideOS.config.get('paths.gcode') + '/' + hash, 'utf8', function(err, gcodeData) {
		if (err) return callback(err);
		this.parseGcode(gcodeData, function() {
			this.status = 'printing';
			this.timeStarted = new Date();
			callback(null, "started printing " + hash);
		}.bind(this));
	}.bind(this));
};

PrinterDriver.prototype.pausePrint = function(callback) {
	this.status = 'paused';
	callback(null, "paused printing");
};

PrinterDriver.prototype.resumePrint = function(callback) {
	this.status = 'printing';
	callback(null, "resume printing");
};

PrinterDriver.prototype.stopPrint = function(callback) {
	this.status = 'online';
	this.currentLine = 0;
	this.gcodeBuffer = [];
	this.timeStarted = new Date().toISOString();
	callback(null, "stopped printing");
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
		// handle wait
	}
	
	if (data.indexOf("SD card inserted") > -1) {
		FormideOS.events.emit('printer.status', { type: 'sdcard_inserted', data: {port: this.port} });
	}
	
	if (data.indexOf("SD card removed") > -1) {
		FormideOS.events.emit('printer.status', { type: 'sdcard_removed', data: {port: this.port} });
	}
	
	if (data.indexOf("T:") > -1 || data.indexOf("T0:") > -1) {
		// T:25.12 /0 B:25.23 /0 B@:0 @:0
		
		var tempArray = data.split(" ");
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
	
	this.messageBuffer.push(data);
	console.log(data);
};

PrinterDriver.prototype.getMessageBuffer = function() {
	return this.messageBuffer;	
};

module.exports = PrinterDriver;