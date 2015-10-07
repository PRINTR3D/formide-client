/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var fs 				= require('fs');
var uuid 			= require('node-uuid');
var deepExtend		= require('deep-extend');
var formideTools	= require('formide-tools');

module.exports = {

	katana: null,
	config: {},

	init: function(config) {
		this.config = config;
		
		process.env.KATANA_BUCKETIN = FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.modelfiles");
		process.env.KATANA_BUCKETOUT = FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.gcode");

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
				if (err) return callback(err);
				
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
	
	createSliceRequest: function(printjobId, callback) {
		
		var self = this;
		
		// creates a slice request from a printjob database entry
		FormideOS.module('db').db.Printjob.findOne({ _id: printjobId }).lean().populate('modelfiles materials printer').exec(function(err, printjob) {
			if (err) return callback(err);
			if (printjob.printer === null) return callback(new Error("Error getting printjob printer"));
			if (printjob.modelfiles.length < 1) return callback(new Error("Error getting printjob modelfiles"));
			if (printjob.materials.length < 1) return callback(new Error("Error getting printjob materials"));
			
			var reference = require(FormideOS.appRoot + "bin/katana-" + self.config.version + ".json");
			
			FormideOS.module('db').db.Sliceprofile.findOne({ _id: printjob.sliceprofile }).lean().exec(function(err, sliceprofile) {
				if (err) return callback(err);
				if (sliceprofile === null) return callback(new Error("Error getting printjob sliceprofile"));
				formideTools.updateSliceprofile(reference, sliceprofile.settings, function(err, fixedSettings, version) {
					if (err) return callback(err);
					FormideOS.module('db').db.Sliceprofile.update({ _id: sliceprofile._id }, { settings: fixedSettings, version: version }, function(err, update) {
						if (err) return callback(err);
					
						var slicerequest = fixedSettings;
						
						// populate bed settings
						slicerequest.bed = {
							xlength: printjob.printer.bed.x * 1000, // input is in mm
							ylength: printjob.printer.bed.y * 1000, // input is in mm
							zlength: printjob.printer.bed.z * 1000, // input is in mm
							temperature: 0,
							firstLayersTemperature: 0
						};
			
						// populate dynamic settings
						if(printjob.sliceSettings) {
							// brim settings
							if(printjob.sliceSettings.brim) {
								if(printjob.sliceSettings.brim.use === false) {
									delete slicerequest.brim;
								}
								else {
									if(printjob.sliceSettings.brim.extruder != undefined) {
										slicerequest.brim.extruder = printjob.sliceSettings.brim.extruder;
									}
									else {
										return callback(new Error("No extruder given for brim"));
									}
								}
							}
							else {
								return callback(new Error("No brim settings given"));
							}
					
							// raft settings
							if(printjob.sliceSettings.raft) {
								if(printjob.sliceSettings.raft.use === false) {
									delete slicerequest.raft;
								}
								else {
									if(printjob.sliceSettings.raft.extruder != undefined) {
										slicerequest.raft.extruder = printjob.sliceSettings.raft.extruder;
									}
									else {
										return callback(new Error("No extruder given for raft"));
									}
								}
							}
							else {
								return callback(new Error("No raft settings given"));
							}
					
							// support settings
							if(printjob.sliceSettings.support) {
								if(printjob.sliceSettings.support.use === false) {
									delete slicerequest.support;
								}
								else {
									if(printjob.sliceSettings.support.extruder != undefined) {
										slicerequest.support.extruder = printjob.sliceSettings.support.extruder;
									}
									else {
										return callback(new Error("No extruder given for support"));
									}
								}
							}
							else {
								return callback(new Error("No support settings given"));
							}
					
							// skirt settings
							if(printjob.sliceSettings.skirt) {
								if(printjob.sliceSettings.skirt.use === false) {
									delete slicerequest.skirt;
								}
								else {
									if(printjob.sliceSettings.skirt.extruder != undefined) {
										slicerequest.skirt.extruder = printjob.sliceSettings.skirt.extruder;
									}
									else {
										return callback(new Error("No extruder given for skirt"));
									}
								}
							}
							else {
								return callback(new Error("No skirt settings given"));
							}
							
							// fan settings
							if(printjob.sliceSettings.fan) {
								if(printjob.sliceSettings.fan.use === false) {
									delete slicerequest.fan;
								}
							}
							else {
								return callback(new Error("No fan settings given"));
							}
					
							// heated bed settings
							if(printjob.sliceSettings.bed) {
								if(printjob.sliceSettings.bed.use !== false) {
									if(printjob.sliceSettings.bed.temperature != undefined) {
										slicerequest.bed.temperature = printjob.sliceSettings.bed.temperature;
									}
									else {
										return callback(new Error("No bed temperature given"));
									}
									if(printjob.sliceSettings.bed.firstLayersTemperature != undefined) {
										slicerequest.bed.firstLayersTemperature = printjob.sliceSettings.bed.firstLayersTemperature;
									}
									else {
										return callback(new Error("No bed firstLayersTemperature given"));
									}
								}
							}
							
							// modelfiles settings
							if(printjob.sliceSettings.modelfiles) {
								if (printjob.sliceSettings.modelfiles.length !== printjob.modelfiles.length) {
									return callback(new Error("Modelfiles and settings.modelfiles have different lengths"));
								}
							}
							else {
								return callback(new Error("No modelfile settings given"));
							}
							
							// override slice parameters
							if(printjob.sliceSettings.override) {
								deepExtend(slicerequest, printjob.sliceSettings.override);
							}
						}
						
						// populate models
						slicerequest.model = [];
						for(var i in printjob.modelfiles) {
							var model = printjob.modelfiles[i];
							var extruderForModel = 0;
							
							if(printjob.sliceSettings.modelfiles[i]) {
								if (printjob.sliceSettings.modelfiles[i].extruder != undefined) {
									extruderForModel = printjob.sliceSettings.modelfiles[i].extruder;
								}
								else {
									return callback(new Error("No extruder given in modelfile settings for model " + i));
								}
							}
							else {
								return callback(new Error("No modelfile settings given for model " + i));
							}
							
							slicerequest.model.push({
								hash: model.hash,
								bucketIn: process.env.KATANA_BUCKETIN,
								position: printjob.sliceSettings.modelfiles[i].position,
								rotation: printjob.sliceSettings.modelfiles[i].rotation,
								scale: printjob.sliceSettings.modelfiles[i].scale,
								extruder: extruderForModel,
								settings: 0
							});
						}
				
						// populate extruders
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
						
						// populate gcode settings
						slicerequest.gcode.gcodeFlavour = printjob.printer.gcodeFlavour;
						slicerequest.gcode.startGcode = printjob.printer.startGcode;
						slicerequest.gcode.endGcode = printjob.printer.endGcode;
						
						// populate other needed parameters
						slicerequest.bucketOut = process.env.KATANA_BUCKETOUT;
						slicerequest.responseID = printjob._id.toString();
						slicerequest.version = version;
				
						return callback(null, slicerequest);
					});
				});
			});
		});
	}
}