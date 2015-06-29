var SerialPort = require("serialport");

function PrinterDriver(port) {
	
	this.statusInterval = 2000;
	
	this.port = port;
	this.matrix = null;
	
	this.status = 'unknown'; // can be: printing, heating, paused, connecting, resuming
	this.progress = 0;
	
	this.targetTemperatures = [];
	this.temperatures = [];
	
	this.targetBedTemperature = 0;
	this.bedTemperature = 0;
	
	this.time = 0;
	this.timeLeft = 0;
	
	this.messageBuffer = [];
		
	var sPort = SerialPort.SerialPort;
	this.sp = new sPort(this.port, {
		baudrate: 250000,
		parser: SerialPort.parsers.readline("\n")
	});
	
	this.sp.on('open', function() {
		console.log("Serial Port is open.");
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
	"stop_all":				"M112",
	"stop":					"",
	"pause":				"",
	"resume":				""
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
// M31:		Time since print started

// M105:	Get Temperatures

// M106: 	Fan On
// M107: 	Fan Off

// M114:	Get current position

// M115: 	Get Firmware Version and Capabilities

// M119: 	Get Endstop Status

// M600:	Pause for filament change

PrinterDriver.prototype.getPrinterInfo = function(callback) {
	this.sp.write("M115" + "\n", function(err, results) {
		callback(err, results);
	});
};

PrinterDriver.prototype.askStatus = function() {	
	this.sp.write("M105" + "\n", function(err, results) {
		
	});
};

PrinterDriver.prototype.getStatus = function(callback) {

};

PrinterDriver.prototype.command = function(command, parameters, callback) {
	var command = this.map[command];
	
	for(var i in parameters) {
		command = command.replace("_" + i + "_", parameters[i]);
	}
	
	this.sp.write(command + "\n", function(err, results) {
		callback(err, results);
	});
};

PrinterDriver.prototype.startPrint = function(fileLocation, callback) {
	// load file and send line by line to printer
};

PrinterDriver.prototype.received = function(data) {
	
	if (data.indexOf("Transformation matrix") > -1) {
		// handle Transformation matrix info
	}
	
	if (data.indexOf("start") > -1) {
		// handle start
	}
	
	if (data.indexOf("ok") > -1 || data.indexOf("OK") > -1) {
		// handle OK
	}
	
	if (data.indexOf("wait") > -1) {
		// handle wait
	}
	
	if (data.indexOf("SD card inserted") > -1) {
		// handle sd card insert
	}
	
	if (data.indexOf("SD card removed") > -1) {
		// handle sd card removed
	}
	
	// handle extruder temperature
	if (data.indexOf("T:") > -1 || data.indexOf("T0:") > -1) {
		// T:25.12 /0 B:25.23 /0 B@:0 @:0
	}
	
	if (data.indexOf("Fanspeed") > -1) {
		// handle fan speed
	}
	
	if (data.indexOf("Info") > -1) {
		// handle info message
	}
	
	this.messageBuffer.push(data);
	console.log(data);
};

PrinterDriver.prototype.getMessageBuffer = function() {
	return this.messageBuffer;	
};

module.exports = PrinterDriver;