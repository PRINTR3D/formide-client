/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var fs 				= require('fs');
var uuid 			= require('node-uuid');
var formideTools	= require('formide-tools');

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
						
						try {
							// generate slicerequest from printjob
							var sliceRequest = formideTools
								.generateSlicerequestFromPrintjob(printjob, fixedSettings, {
									version: version,
									bucketIn: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.modelfiles"),
									bucketOut: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.gcode"),
									responseId: printjob._id.toString()
								})
								.generateBaseSettings()
								.generatePrinterGcodeSettings()
								.generateRaftSettings()
								.generateSupportSettings()
								.generateSkirtSettings()
								.generateFanSettings()
								.generateBedSettings()
								.generateOverrideSettings()
								.generateModelSettings()
								.generateExtruderSettings()
								.getResult();
							
							return callback(null, sliceRequest);
						}
						catch (e) {
							return callback(e);
						}
					});
				});
			});
		});
	}
}