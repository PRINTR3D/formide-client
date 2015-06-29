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

// dependencies
var spawn 	= require('child_process').spawn;
var fs 		= require('fs');
var net 	= require('net');
var uuid 	= require('node-uuid');

module.exports = {
	
	process: null,
	
	slicer: {},

	init: function(config) {
		this.config = config;

		if(config.simulated) {
			this.process = spawn('node', ['slicesim.js'], { cwd: FormideOS.appRoot + 'core/utils', stdio: 'pipe' });
			this.process.stdout.setEncoding('utf8');
			this.process.stdout.on('exit', this.onExit);
			this.process.stdout.on('error', this.onError);
			this.process.stdout.on('data', this.onData);
		}
		else {
			if(process.platform == 'darwin') {
				this.process = spawn('./katana', { cwd: FormideOS.appRoot + 'bin/osx/katana', stdio: 'pipe' });
			}
			else if(process.platform == 'linux' && process.arch == 'arm' ) {
				this.process = spawn('./katana', { cwd: FormideOS.appRoot + 'bin/rpi/katana', stdio: 'pipe' });
			}
		}

		this.slicer = new net.Socket();
		this.connect();
		this.slicer.on('error', this.slicerError.bind(this));
		this.slicer.on('data', this.sliceResponse.bind(this));
		this.slicer.on('close', this.slicerError.bind(this));

		FormideOS.events.on('process.exit', this.stop.bind(this));
	},
	
	dispose: function() {
		this.stop();
	},

	connect: function() {
		this.slicer.destroy();
		this.slicer.connect({
			port: this.config.port
		}, function() {
			FormideOS.debug.log('slicer connected');
		});
	},

	onExit: function(exit) {
		FormideOS.debug.log(exit, true);
	},

	onError: function(error) {
		FormideOS.debug.log(error, true);
	},

	onData: function(data) {
		FormideOS.debug.log(data);
	},

	stop: function(stop) {
		this.process.kill('SIGINT');
	},

	// custom functions
	slicerError: function(error) {
		FormideOS.debug.log(error.toString(), true);
		FormideOS.module('log').logError({
			message: "Slicer error",
			data: error
		});
		if (error.code == 'ECONNREFUSED' || error == false) {
			this.slicer.setTimeout(2000, function() {
				this.connect();
			}.bind(this));
		}
	},

	// custom functions
	slice: function(modelfiles, sliceprofile, materials, printer, settings, callback) {
		var self = this;
		var hash = uuid.v4();
		FormideOS.module('db').db.Printjob.create({
			modelfiles: modelfiles,
			printer: printer,
			sliceprofile: sliceprofile,
			materials: materials,
			sliceFinished: false,
			sliceSettings: settings,
			sliceMethod: "local"
		}, function(err, printjob) {
			if (err) return callback(err);
			self.createSliceRequest(printjob._id, function(err, slicerequest) {
				if (err) return callback(err);
				
				var sliceData = {
					type: "slice",
					data: slicerequest
				};
				
				// write slicerequest to local Katana instance
				self.slicer.write(JSON.stringify(sliceData) + '\n', function() {
					FormideOS.events.emit('slicer.slice', slicerequest);
					return callback(null, slicerequest);
				});
			});
		});
	},
	
	createSliceRequest: function(printjobId, callback) {
		
		// creates a slice request from a printjob database entry
		FormideOS.module('db').db.Printjob.findOne({ _id: printjobId }).lean().populate('modelfiles sliceprofile materials printer').exec(function(err, printjob) {
		
			var slicerequest = printjob.sliceprofile.settings;
			
			slicerequest.bed = {
				xlength: printjob.printer.bed.x * 1000,
				ylength: printjob.printer.bed.y * 1000,
				zlength: printjob.printer.bed.z * 1000,
				temperature: 0,
				firstLayersTemperature: 0
			};
		
			if(printjob.sliceSettings) {
				if(printjob.sliceSettings.brim) {
					if(printjob.sliceSettings.brim.use === false) {
						delete slicerequest.brim;
					}
					else {
						if(printjob.sliceSettings.brim.extruder) {
							slicerequest.brim.extruder = printjob.sliceSettings.brim.extruder;
						}
						else {
							return callback("No extruder given for brim");
						}
					}
				}
				else {
					return callback("No brim settings given");
				}
				
				if(printjob.sliceSettings.raft) {
					if(printjob.sliceSettings.raft.use === false) {
						delete slicerequest.raft;
					}
					else {
						if(printjob.sliceSettings.raft.extruder) {
							slicerequest.raft.extruder = printjob.sliceSettings.raft.extruder;
						}
						else {
							return callback("No extruder given for raft");
						}
					}
				}
				else {
					return callback("No raft settings given");
				}
				
				if(printjob.sliceSettings.support) {
					if(printjob.sliceSettings.support.use === false) {
						delete slicerequest.support;
					}
					else {
						if(printjob.sliceSettings.support.extruder) {
							slicerequest.support.extruder = printjob.sliceSettings.support.extruder;
						}
						else {
							return callback("No extruder given for support");
						}
					}
				}
				else {
					return callback("No support settings given");
				}
				
				if(printjob.sliceSettings.skirt) {
					if(printjob.sliceSettings.skirt.use === false) {
						delete slicerequest.skirt;
					}
					else {
						if(printjob.sliceSettings.skirt.extruder) {
							slicerequest.skirt.extruder = printjob.sliceSettings.skirt.extruder;
						}
						else {
							return callback("No extruder given for skirt");
						}
					}
				}
				else {
					return callback("No skirt settings given");
				}
				
				if(printjob.sliceSettings.fan) {
					if(printjob.sliceSettings.fan.use === false) {
						delete slicerequest.fan;
					}
					else {
						if(printjob.sliceSettings.fan.speed) {
							slicerequest.fan.speed = printjob.sliceSettings.fan.speed;
						}
						else {
							return callback("No speed given for fan");
						}
					}
				}
				else {
					return callback("No fan settings given");
				}
				
				if(printjob.sliceSettings.bed) {
					if(printjob.sliceSettings.bed.use !== false) {
						if(printjob.sliceSettings.bed.temperature) {
							slicerequest.bed.temperature = printjob.sliceSettings.bed.temperature;
						}
						else {
							return callback("No bed temperature given");
						}
						if(printjob.sliceSettings.bed.firstLayersTemperature) {
							slicerequest.bed.firstLayersTemperature = printjob.sliceSettings.bed.firstLayersTemperature;
						}
						else {
							return callback("No bed firstLayersTemperature given");
						}
					}
				}
			}
			
			slicerequest.model = [];
			for(var i in printjob.modelfiles) {
				var model = printjob.modelfiles[i];
				var extruderForModel = 0;
				if(printjob.sliceSettings.modelfiles) {
					printjob.sliceSettings.modelfiles[i].extruder;
				}
				slicerequest.model.push({
					hash: model.hash,
					bucketIn: FormideOS.appRoot + FormideOS.config.get("paths.modelfile"),
					x: 100000, 		// TODO: set user specified position
					y: 100000, 		// TODO: set user specified position
					z: 0, 			// TODO: set user specified position
					extruder: extruderForModel,
					settings: 0 	// TODO: set region settings
				});
			}
			
			slicerequest.extruders = [];
			for(var i in printjob.printer.extruders) {
				var extruder = printjob.printer.extruders[i];
				var material = printjob.materials[i];
				if(material) {
					slicerequest.extruders.push({
						name: extruder.name,
						material: material.type,
						nozzleSize: extruder.nozzleSize,
						temperature: material.temperature,
						firstLayersTemperature: material.firstLayersTemperature,
						filamentDiameter: material.filamentDiameter,
						feedrate: material.feedrate
					});
				}
			}
			
			slicerequest.bucketOut = FormideOS.appRoot + FormideOS.config.get("paths.gcode");
			slicerequest.responseID = printjob._id.toString();
		
			callback(null, slicerequest);
		});
	},

	sliceResponse: function(stream) {
		try {
			FormideOS.utils.parseTCPStream(stream, function(data) {
				if(data.status == 200 && data.data.responseID != null) {
					FormideOS.debug.log(data);
					FormideOS.module('db').db.Printjob
					.update({ _id: data.data.responseID }, { gcode: data.data.gcode, sliceResponse: data.data, sliceFinished: true }, function(err, printjob) {
						if (err) return;
						FormideOS.events.emit('slicer.finished', {
							type: 'success',
							title: 'Slicer finished',
							message: 'Slicer finished slicing ' + data.data.responseID,
							notification: true
						});
					});
				}
				else if(data.status === 110 || data.status === 111 || data.status === 112 || data.status === 120) { // filter for progress response codes
					FormideOS.events.emit('slicer.progress', data.data);
				}
				else {
					FormideOS.debug.log(data, true);
					FormideOS.module('log').logError({
						message: 'slicer error',
						data: data
					});
					FormideOS.events.emit('slicer.finished', {
						type: 'warning',
						title: 'Slicer error',
						message: 'Slicing failed slicing ' + data.data.responseID,
						notification: true
					});
				}
			});
		}
		catch(e) {
			FormideOS.debug.log(e, true);
			FormideOS.module('log').logError({
				message: 'slice response parse error',
				data: e
			});
		}
	}
}