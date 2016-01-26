/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const assert = require('assert');
const fs	 = require('fs-extra');
const path   = require('path');
const uuid   = require('node-uuid');

module.exports = (routes, db) => {

	/**
	 * Get a list of printJobs
	 */
	routes.get('/printjobs', (req, res) => {
		db.PrintJob
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.populate('printer')
		.populate('sliceProfile')
		.populate('materials')
		.populate('files')
		.then(res.ok)
		.error(res.serverError);
	});

	/**
	 * Get single printJob
	 */
	routes.get('/printjobs/:id', (req, res) => {
		db.PrintJob
		.find({  id: req.params.id, createdBy: req.user.id })
		.populate('printer')
		.populate('sliceProfile')
		.populate('materials')
		.populate('files')
		.then((printJob) => {
			if (!printJob) return res.notFound();
			return res.ok(printJob);
		})
		.error(res.serverError);
	});

	/**
	 * Add a printJob from custom gcode
	 */
	routes.post('/printjobs', (req, res) => {
		assert(req.body);
		assert(req.body.gcodeID);

		db.UserFile
		.findOne({ id: req.body.gcodeID })
		.then(userFile => {

			// copy gcode file to gcodes folder so original file can be deleted
			var filename = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.modelfiles'), userFile.hash);
			var newHash = uuid.v4();
			var newFilename = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.gcode'), newHash);
			fs.copySync(filename, newFilename);

			db.PrintJob
			.create({
				name:			userFile.filename,
				sliceMethod:	"custom",
				sliceFinished:	true,
				gcode:			newHash,
				files:			[ userFile.id ], // only 1 gcode per custom printJob is allowed
				createdBy:		req.user.id
			})
			.then(printJob => {
				return res.ok({ message: "Printjob created from custom gcode", printJob });
			})
			.catch(res.serverError);
		});
	});

	/**
	 * Delete a printJob
	 */
	routes.delete('/printjobs/:id', (req, res) => {
		db.PrintJob
		.findOne({ id: req.params.id, createdBy: req.user.id })
		.then(printJob => {
			// delete file from storage
			var filePath = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.gcode'), printJob.gcode);
			try {
				fs.unlinkSync(filePath);
			}
			catch (e) {
				FormideOS.log.warn('file could not be deleted from storage');
			}

			// delete from database
			printJob.destroy(function (err) {
				if (err) return res.serverError(err);
				return res.ok({ message: "Printjob deleted" });
			});
		})
		.catch(res.serverError);
	});
};
