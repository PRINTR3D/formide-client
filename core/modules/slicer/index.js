/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var fs 				= require('fs');
var uuid 			= require('node-uuid');
var formideTools	= require('formide-tools');
var assert			= require('assert');

module.exports = {

	katana: null,
	config: {},

	init: function(config) {
		this.config = config;

		// loaded via katana-slicer npm package and node-pre-gyp
		try {
			this.katana = require('katana-slicer');
		}
		catch (e) {
			FormideOS.log.error('error loading katana-slicer bin', e);
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
	slice: function(userId, files, sliceProfile, materials, printer, settings, callback) {

		if (this.katana === null) return res.serverError(new Error('slicer not loaded'));

		var self = this;
		var hash = uuid.v4();
		var responseId = uuid.v4();
		var callback = callback;

		FormideOS.db.PrintJob.create({
			files: files,
			printer: printer,
			sliceProfile: sliceProfile,
			materials: materials,
			sliceFinished: false,
			sliceSettings: settings,
			sliceMethod: "local",
			createdBy: userId,
			responseId: responseId
		}, function(err, printJob) {
			if (err) return callback(err);

			self.createSliceRequest(printJob.id, function(err, sliceRequest) {
				if (err) return callback(err);

				callback(null, printJob);

				var sliceData = {
					type: "slice",
					data: sliceRequest
				};

				// write slicerequest to local Katana instance
				FormideOS.events.emit('slicer.started', {
					title: "Slicer started",
					message: "Started slicing " + printJob.id,
					data: sliceRequest
				});

				self.katana.slice(JSON.stringify(sliceData), function(response) {

					console.log('slicer response', response);

					try {
						var response = JSON.parse(response);

						if(response.status == 200 && response.data.responseId != null) {
							FormideOS.db.PrintJob
							.update({ responseId: response.data.responseId }, {
								gcode: response.data.hash,
								sliceResponse: response.data,
								sliceFinished: true
							}, function(err, printJob) {
								if (err) FormideOS.log.error(err.message);
								FormideOS.events.emit('slicer.finished', {
									title: "Slicer finished",
									message: "Finished slicing " + response.data.responseId,
									data: response.data,
									notification: true
								});
								return;
							});
						}
						else if(response.status === 120) {
							FormideOS.events.emit('slicer.progress', response.data);
						}
						else {
							FormideOS.db.PrintJob
							.update({ responseId: response.data.responseId }, {
								sliceResponse: response.data,
								sliceFinished: false
							}, function(err, printJob) {
								if (err) FormideOS.log.error(err.message);
								FormideOS.events.emit('slicer.failed', {
									title: "Slicer error",
									status: response.status,
									message: response.data.msg,
									data: response.data,
									notification: true
								});
								return;
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

	createSliceRequest: function(printJobId, callback) {

		var self = this;

		// creates a slice request from a PrintJob database entry
		FormideOS.db.PrintJob
		.findOne({ id: printJobId })
		.populate('files')
		.populate('materials')
		.populate('printer')
		.populate('sliceProfile')
		.exec((err, printJob) => {
			if (err) return callback(err);
			assert(printJob.printer, 'no printer found');
			assert(printJob.files, 'no files found');
			//assert(printJob.files.length < 1, 'files should be 1 or larger');
			assert(printJob.materials, 'no materials found');
			//assert(printJob.materials.length < 1, 'materials should be 1 or larger');
			assert(printJob.sliceProfile, 'no sliceprofile found');

			var reference = require('katana-slicer/reference.json');
			var version = printJob.sliceProfile.version || reference.version;

			formideTools.updateSliceprofile(reference, version, printJob.sliceProfile.settings, function(err, fixedSettings, version) {
				if (err) return callback(err);

				FormideOS.db.SliceProfile.update({ id: printJob.sliceProfile.id }, { settings: fixedSettings, version: version }, function(err, update) {
					if (err) return callback(err);

					FormideOS.db.PrintJob
					.findOne({ id: printJobId })
					.populate('files')
					.populate('materials')
					.populate('printer')
					.populate('sliceProfile')
					.exec((err, printJob) => {
						if (err) return callback(err);

						try {
							var sliceRequest = formideTools
							.generateSlicerequestFromPrintjob(printJob.toObject(), {
								version: version,
								bucketIn: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.modelfiles"),
								bucketOut: FormideOS.config.get('app.storageDir') + FormideOS.config.get("paths.gcode"),
								responseId: printJob.responseId
							})
							.generateBaseSettings()
							.generatePrinterGcodeSettings()
							.generateRaftSettings()
							.generateSupportSettings()
							.generateSkirtSettings()
							.generateFanSettings()
							.generateBedSettings()
							.generateModelSettings()
							.generateExtruderSettings()
							.generateOverrideSettings()
							.getResult();

							return callback(null, sliceRequest);
						}
						catch(e) {
							return callback(e);
						}

					});
				});
			});
		});
	},

	getReferenceFile: function(callback) {
		var reference = require('katana-slicer/reference.json');
		return callback(null, reference);
	}
}
