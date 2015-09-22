/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var fs 			= require('fs');
var uuid 		= require('node-uuid');
var deepExtend	= require("deep-extend");

module.exports = {

	katana: null,
	config: {},

	init: function(config) {
		this.config = config;

		if(process.platform == 'darwin') {
			this.katana	= require(FormideOS.appRoot + 'bin/osx/katana');
			FormideOS.debug.log('Binded katana in osx/katana');
		}
		else if(process.platform == 'linux') {
			this.katana	= require(FormideOS.appRoot + 'bin/rpi/katana');
			FormideOS.debug.log('Binded katana in rpi/katana');
		}
	},

	// custom functions
	slicerError: function(error) {
		if (error.code == 'ECONNREFUSED' || error == false) {
			this.open = false;
			this.slicer.setTimeout(2000, function() {
				this.connect();
			}.bind(this));
		}
	},

	// custom functions
	slice: function(modelfiles, sliceprofile, materials, printer, settings, callback) {
		
		var self = this;
		var hash = uuid.v4();
		var callback = callback;
		
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
				if (err) callback(err);
				
				callback(null, printjob);
				
				var sliceData = {
					type: "slice",
					data: slicerequest
				};
				
				// write slicerequest to local Katana instance
				FormideOS.events.emit('slicer.started', {
					title: "Slicer started",
					message: "Started slicing " + printjob._id,
					data: slicerequest
				});
				
				self.katana.slice(JSON.stringify(sliceData), function(response) {
					
					try {
						var response = JSON.parse(response);
						
						if(response.status == 200 && response.data.responseID != null) {
							FormideOS.module('db').db.Printjob
							.update({ _id: response.data.responseID }, {
								gcode: response.data.gcode,
								sliceResponse: response.data,
								sliceFinished: true
							}, function(err, printjob) {
								if (err) FormideOS.debug.log(err);
								FormideOS.events.emit('slicer.finished', {
									title: "Slicer finished",
									message: "Finished slicing " + response.data.responseID,
									data: response.data
								});
							});
						}
						else if(response.status === 120) {
							FormideOS.events.emit('slicer.progress', response.data);
						}
						else {
							FormideOS.module('db').db.Printjob
							.update({ _id: response.data.responseID }, {
								sliceResponse: response.data,
								sliceFinished: false
							}, function(err, printjob) {
								if (err) FormideOS.debug.log(err);
								FormideOS.events.emit('slicer.failed', {
									title: "Slicer error",
									status: response.status,
									message: response.data.msg,
									data: response.data
								});
							});
						}
					}
					catch(e) {
						FormideOS.debug.log(e);
					}
				});
			});
		});
	},
	
	checkSliceprofile: function(sliceprofileId, callback) {
		var reference = require(FormideOS.appRoot + "bin/katana-" + this.config.version + ".json");
		FormideOS.module('db').db.Sliceprofile.findOne({ _id: sliceprofileId }).lean().exec(function(err, sliceprofile) {
			if (err) return callback("Error getting sliceprofile: " + err.message);
			
			var settings = sliceprofile.settings;
			
			if (reference.version !== sliceprofile.version) {
				FormideOS.debug.log("Used sliceprofile is not the current version, updating to latest parameter set...");
				sliceprofile.version = reference.version; // update version number
			}
			else {
				FormideOS.debug.log("Used sliceprofile is the current version, checking parameter set anyway...")
			}
			
			for (var i in reference.sliceProfile) {
				
				// 1: Check if sliceprofileObject is in current sliceprofile. If not, create empty object and continue.
				if (typeof settings[i] === "undefined") {
					settings[i] = {};
					console.log("Fixed missing object: " + i);
				}
				
				// 2: Check all fields in a sliceprofileObject. If not there, add it with the given default value.
				for (var j in reference.sliceProfile[i]) {
					if (typeof settings[i][j] === "undefined") {
						settings[i][j] = reference.sliceProfile[i][j].default;
						console.log("Fixed missing parameter: " + i + " - " + j);
					}
				}
				
				// 3: Check all fields in a sliceprofileObject for their values and fix invalid values.
				for (var j in reference.sliceProfile[i]) {
					if (typeof settings[i][j] !== "undefined") {
						if (reference.sliceProfile[i][j].minvalue && reference.sliceProfile[i][j].minvalue > settings[i][j]) {
							settings[i][j] = reference.sliceProfile[i][j].minvalue;
							console.log("Fixed out of bounds parameter: " + i + " - " + j);
						}
						if (reference.sliceProfile[i][j].maxvalue && reference.sliceProfile[i][j].maxvalue < settings[i][j]) {
							settings[i][j] = reference.sliceProfile[i][j].maxvalue;
							console.log("Fixed out of bounds parameter: " + i + " - " + j);
						}
					}
				}
			}
			
			// 4: Check all depricated fields and remove them from sliceprofile
			for (var i in reference.deprecated) {
				if (typeof settings[i] !== "undefined") {
					for (var j in reference.deprecated[i]) {
						if (typeof settings[i][reference.deprecated[i][j]] !== "undefined") {
							delete settings[i][reference.deprecated[i][j]];
							console.log("Fixed deprecated parameter: " + i + " - " + reference.deprecated[i][j]);
						}
					}
				}
			}
			
			// 5: Save sliceprofile and use in next step.
			sliceprofile.settings = settings;
			
			FormideOS.module('db').db.Sliceprofile.update({ _id: sliceprofile._id }, { settings: settings, version: sliceprofile.version }, function(err, update) {
				if (err) return callback("Error updating sliceprofile: " + err.message);
				return callback(null, sliceprofile);
			});
		});
	},
	
	createSliceRequest: function(printjobId, callback) {
		
		var self = this;
		
		// creates a slice request from a printjob database entry
		FormideOS.module('db').db.Printjob.findOne({ _id: printjobId }).lean().populate('modelfiles materials printer').exec(function(err, printjob) {
			if (err) return callback("Error getting printjob: " + err.message);
			if (printjob.printer === null) return callback("Error getting printjob printer");
			if (printjob.modelfiles.length < 1) return callback("Error getting printjob modelfiles");
			if (printjob.materials.length < 1) return callback("Error getting printjob materials");
			
			self.checkSliceprofile(printjob.sliceprofile, function(err, fixedSliceprofile) {
				if (err) return callback("Error checking sliceprofile: " + err.message);	
			
				var slicerequest = fixedSliceprofile.settings;
				
				slicerequest.bed = {
					xlength: printjob.printer.bed.x * 1000, // input is in mm
					ylength: printjob.printer.bed.y * 1000, // input is in mm
					zlength: printjob.printer.bed.z * 1000, // input is in mm
					temperature: 0,
					firstLayersTemperature: 0
				};
			
				if(printjob.sliceSettings) {
					if(printjob.sliceSettings.brim) {
						if(printjob.sliceSettings.brim.use === false) {
							delete slicerequest.brim;
						}
						else {
							if(printjob.sliceSettings.brim.extruder != undefined) {
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
							if(printjob.sliceSettings.raft.extruder != undefined) {
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
							if(printjob.sliceSettings.support.extruder != undefined) {
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
							if(printjob.sliceSettings.skirt.extruder != undefined) {
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
					}
					else {
						return callback("No fan settings given");
					}
					
					if(printjob.sliceSettings.bed) {
						if(printjob.sliceSettings.bed.use !== false) {
							if(printjob.sliceSettings.bed.temperature != undefined) {
								slicerequest.bed.temperature = printjob.sliceSettings.bed.temperature;
							}
							else {
								return callback("No bed temperature given");
							}
							if(printjob.sliceSettings.bed.firstLayersTemperature != undefined) {
								slicerequest.bed.firstLayersTemperature = printjob.sliceSettings.bed.firstLayersTemperature;
							}
							else {
								return callback("No bed firstLayersTemperature given");
							}
						}
					}
					
					// override slice parameters
					if(printjob.sliceSettings.override) {
						deepExtend(slicerequest, printjob.sliceSettings.override);
					}
				}
				
				slicerequest.model = [];
				for(var i in printjob.modelfiles) {
					var model = printjob.modelfiles[i];
					var extruderForModel = 0;
					var xPos = 0;
					var yPos = 0;
					var zPos = 0;
					
					if(printjob.sliceSettings.modelfiles) {
						extruderForModel = printjob.sliceSettings.modelfiles[i].extruder;
						xPos = 100000; //printjob.sliceSettings.modelfiles[i].root.x * 1000; // input is in mm
						yPos = 100000; //printjob.sliceSettings.modelfiles[i].root.z * 1000; // three.js uses y as height!
						zPos = 0; //printjob.sliceSettings.modelfiles[i].root.y * 1000; // three.js uses y as height!
					}
					
					slicerequest.model.push({
						hash: model.hash,
						bucketIn: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.modelfile"),
						x: xPos,
						y: yPos,
						z: zPos,
						extruder: extruderForModel,
						settings: 0
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
				
				slicerequest.bucketOut = FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.gcode");
				slicerequest.responseID = printjob._id.toString();
				slicerequest.version = fixedSliceprofile.version;
				
				callback(null, slicerequest);
			});
		});
	}
}