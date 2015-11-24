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

		// loaded via formide-drivers npm package and node-pre-gyp
		this.katana = require('katana-slicer');
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

		FormideOS.db.Printjob.create({
			modelfiles: modelfiles,
			printer: printer,
			sliceprofile: sliceprofile,
			materials: materials,
			sliceFinished: false,
			sliceSettings: settings,
			sliceMethod: "local"
		}, function(err, printjob) {
			if (err) return callback(err);

			self.createSliceRequest(printjob.id, function(err, slicerequest) {
				if (err) return callback(err);

				callback(null, printjob);

				var sliceData = {
					type: "slice",
					data: slicerequest
				};

				// write slicerequest to local Katana instance
				FormideOS.events.emit('slicer.started', {
					title: "Slicer started",
					message: "Started slicing " + printjob.id,
					data: slicerequest
				});

				self.katana.slice(JSON.stringify(sliceData), function(response) {

					try {
						var response = JSON.parse(response);

						if(response.status == 200 && response.data.responseId != null) {
							FormideOS.db.Printjob
							.update({ id: response.data.responseId }, {
								gcode: response.data.gcode,
								sliceResponse: response.data,
								sliceFinished: true
							}, function(err, printjob) {
								if (err) FormideOS.log.error(err.message);
								FormideOS.events.emit('slicer.finished', {
									title: "Slicer finished",
									message: "Finished slicing " + response.data.responseId,
									data: response.data,
									notification: true
								});
							});
						}
						else if(response.status === 120) {
							FormideOS.events.emit('slicer.progress', response.data);
						}
						else {
							FormideOS.db.Printjob
							.update({ id: response.data.responseId }, {
								sliceResponse: response.data,
								sliceFinished: false
							}, function(err, printjob) {
								if (err) FormideOS.log.error(err.message);
								FormideOS.events.emit('slicer.failed', {
									title: "Slicer error",
									status: response.status,
									message: response.data.msg,
									data: response.data,
									notification: true
								});
							});
						}
					}
					catch(e) {
						FormideOS.log.error(e.message);
					}
				});
			});
		});
	},

	createSliceRequest: function(printjobId, callback) {

		var self = this;

		// creates a slice request from a printjob database entry
		FormideOS.db.Printjob.findOne({ id: printjobId }).lean().populate('modelfiles materials printer').exec(function(err, printjob) {
			if (err) return callback(err);
			if (printjob.printer === null) return callback(new Error("Error getting printjob printer"));
			if (printjob.modelfiles.length < 1) return callback(new Error("Error getting printjob modelfiles"));
			if (printjob.materials.length < 1) return callback(new Error("Error getting printjob materials"));

			var reference = require(FormideOS.appRoot + "/bin/reference-" + self.config.version + ".json");

			FormideOS.db.Sliceprofile.findOne({ id: printjob.sliceprofile }).lean().exec(function(err, sliceprofile) {
				if (err) return callback(err);
				if (sliceprofile === null) return callback(new Error("Error getting printjob sliceprofile"));
				formideTools.updateSliceprofile(reference, sliceprofile.settings, function(err, fixedSettings, version) {
					if (err) return callback(err);
					FormideOS.db.Sliceprofile.update({ id: sliceprofile.id }, { settings: fixedSettings, version: version }, function(err, update) {
						if (err) return callback(err);

						try {
							// generate slicerequest from printjob
							var sliceRequest = formideTools
								.generateSlicerequestFromPrintjob(printjob, fixedSettings, {
									version: version,
									bucketIn: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.modelfiles"),
									bucketOut: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.gcode"),
									responseId: printjob.id.toString()
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
	},

	// TODO: update to load slicer as npm module
	getReferenceFile: function(callback) {
		var reference = require(FormideOS.appRoot + "/bin/reference-" + this.config.version + ".json");
		return callback(null, reference);
	}
}
