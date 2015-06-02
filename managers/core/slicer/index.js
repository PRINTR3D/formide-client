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

		if(config.simulated)
		{
			this.process = spawn('node', ['slicesim.js'], {cwd: FormideOS.appRoot + 'utils', stdio: 'pipe'});
			this.process.stdout.setEncoding('utf8');
			this.process.stdout.on('exit', this.onExit);
			this.process.stdout.on('error', this.onError);
			this.process.stdout.on('data', this.onData);
		}

		this.slicer = new net.Socket();
		this.connect();
		this.slicer.on('error', this.slicerError.bind(this));
		this.slicer.on('data', this.sliceResponse.bind(this));
		this.slicer.on('close', this.slicerError.bind(this));

		FormideOS.manager('core.events').on('process.exit', this.stop.bind(this));
	},

	connect: function() {
		this.slicer.destroy();
		this.slicer.connect({
			port: this.config.port
		}, function() {
			FormideOS.manager('debug').log('slicer connected');
		});
	},

	onExit: function(exit) {
		FormideOS.manager('debug').log(exit, true);
	},

	onError: function(error) {
		FormideOS.manager('debug').log(error, true);
	},

	onData: function(data) {
		FormideOS.manager('debug').log(data);
	},

	stop: function(stop) {
		this.process.kill('SIGINT');
	},

	// custom functions
	slicerError: function(error) {
		FormideOS.manager('debug').log(error.toString(), true);
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
		FormideOS.manager('core.db').db.Printjob.create({
			modelfiles: modelfiles,
			printer: printer,
			sliceprofile: sliceprofile,
			materials: materials,
			sliceFinished: false,
			sliceSettings: JSON.parse(settings),
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
					FormideOS.manager('core.events').emit('slicer.slice', slicerequest);
					return callback(null, slicerequest);
				});
			});
		});
		
/*
		FormideOS.manager('app.log').logDebug( 'debug', sliceparams );

		var sliceData = {
			"type": "slice",
			"data": sliceparams
		};
*/
/*
		FormideOS.manager('core.db').db.Modelfile
		.find({ where: {id: modelfile } })
		.then(function(dbModelfile)
		{
			// TODO: still hardcoded to 10 by 10 cm and with extruder 1
			var model = {
				"hash": dbModelfile.hash,
				"bucketIn": FormideOS.appRoot + FormideOS.config.get('paths.modelfile'),
				"x": 100000,
				"y": 100000,
				"z": 0,
				"extruder": "extruder1",
				"settings": "0"
			};

			sliceData.data.model = [model];
			sliceData.data.bucketOut = FormideOS.appRoot + FormideOS.config.get('paths.gcode');
			sliceData.data.responseID = hash;

			FormideOS.manager('core.db').db.Printjob
			.create(
			{
				ModelfileId: 	modelfile,
				printerID: 		printer,
				sliceprofileID: sliceprofile,
				materials: 		JSON.stringify( materials ),
				sliceResponse: 	"{" + hash + "}",
				sliceParams: 	JSON.stringify( sliceparams ),
				sliceMethod: 	'local'
			})
			.success(function(printjob)
			{
				// send slice request to local slicer
				self.slicer.write(JSON.stringify(sliceData) + '\n', function() {
					FormideOS.manager('core.events').emit('slicer.slice', sliceData);
					return callback(true);
				});
			});
		});
*/
	},
	
	createSliceRequest: function(printjobId, callback) {
		
		// creates a slice request from a printjob database entry
		FormideOS.manager('core.db').db.Printjob.findOne({ _id: printjobId }).lean().populate('modelfiles sliceprofile materials printer').exec(function(err, printjob) {
		
			var slicerequest = printjob.sliceprofile.settings;
			
			slicerequest.bed = {
				xlength: printjob.printer.buildVolume.x * 1000,
				ylength: printjob.printer.buildVolume.y * 1000,
				zlength: printjob.printer.buildVolume.z * 1000,
				temperature: printjob.materials[0].temperature, // hardcoded material 0 by default
				firstLayersTemperature: printjob.materials[0].firstLayersTemperature // hardcoded material 0 by default
			};
		
			if(printjob.sliceSettings.brim) {
				if(printjob.sliceSettings.brim.use === false) {
					slicerequest.extra.brimLines = 0;
				}
			}
			
			if(printjob.sliceSettings.raft) {
				if(printjob.sliceSettings.raft.use === false) {
					delete slicerequest.raft;
				}
			}
			
			if(printjob.sliceSettings.support) {
				if(printjob.sliceSettings.support.use === false) {
					delete slicerequest.support;
				}
			}
			
			if(printjob.sliceSettings.skirt) {
				if(printjob.sliceSettings.skirt.use === false) {
					delete slicerequest.skirt;
				}
			}
			
			if(printjob.sliceSettings.fan) {
				if(printjob.sliceSettings.fan.use === false) {
					delete slicerequest.fan;
				}
			}
			
			if(printjob.sliceSettings.bed) {
				if(printjob.sliceSettings.bed.use === false) {
					slicerequest.bed.temperature = 0;
					slicerequest.bed.firstLayersTemperature = 0;
				}
			}
			
			slicerequest.model = [];
			for(var i in printjob.modelfiles) {
				var model = printjob.modelfiles[i];
				slicerequest.model.push({
					hash: model.hash,
					bucketIn: FormideOS.appRoot + FormideOS.config.get("paths.modelfile"),
					x: 100000, // TODO: set user specified position
					y: 100000, // TODO: set user specified position
					z: 0, // TODO: set user specified position
					extruder: "extruder1", // TODO: set extruder dynamically
					settings: "0" // TODO: set region settings
				});
			}
			
			slicerequest.extruders = [];
			for(var i in printjob.printer.extruders) {
				var extruder = printjob.printer.extruders[i];
				var material = printjob.materials[i];
				slicerequest.extruders.push({
					name: extruder.name,
					material: material.type,
					nozzleSize: extruder.nozzleSize,
					temperature: material.temperature,
					firstLayersTemperature: material.firstLayersTemperature,
					filamentDiameter: material.filamentDiameter,
					feedrate: material.feedrate,
					mode: 'model' // TODO: remove from slicer
				});
			}
			
			slicerequest.bucketOut = FormideOS.appRoot + FormideOS.config.get("paths.gcode"); // TODO: specify bucketOut
			slicerequest.responseID = printjob._id.toString();
		
			callback(null, slicerequest);
		});
	},

	sliceResponse: function(stream) {
		try { // try parsing
			FormideOS.utils.parseTCPStream(stream, function(data) {
				if(data.status == 200 && data.data.responseID != null) {
					FormideOS.manager('debug').log(data);
					FormideOS.manager('core.db').db.Printjob
					.update({ _id: data.data.responseID }, { gcode: data.data.gcode, sliceResponse: data.data, sliceFinished: true }, function(err, printjob) {
						if (err) return;
						FormideOS.manager('core.events').emit('slicer.finished', {
							type: 'success',
							title: 'Slicer finished',
							message: 'Slicer finished slicing ' + data.data.responseID,
							notification: true
						});
					});
				}
				else if(data.status == 111) {
					// status, do later
				}
				else {
					FormideOS.manager('debug').log(data, true);
					FormideOS.manager('app.log').logError({
						message: 'slicer error',
						data: data
					});
					FormideOS.manager('core.events').emit('slicer.finished', {
						type: 'warning',
						title: 'Slicer error',
						message: 'Slicing failed slicing ' + data.data.responseID,
						notification: true
					});
				}
			});
		}
		catch(e) {
			FormideOS.manager('debug').log(e, true);
		}
	}
}