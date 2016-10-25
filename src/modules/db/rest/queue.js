/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const assert = require('assert');
const path   = require('path');
const fs     = require('fs');

module.exports = (routes, db) => {

	/**
	 * Get all queueItems or for a single printer
	 */
	routes.get('/queue', (req, res) => {
		if (req.query.port) {
			db.QueueItem
			.find({ port: req.query.port })
			.then(res.ok)
			.error(res.serverError);
		}
		else {
			db.QueueItem
			.find()
			.then(res.ok)
			.error(res.serverError);
		}
	});

	/**
	 * Get a single queueItem
	 */
	routes.get('/queue/:id', (req, res) => {
		db.QueueItem
		.findOne({ id: req.params.id })
		.then((queueItem) => {
			if (!queueItem) return res.notFound();
			return res.ok(queueItem);
		})
		.catch(res.serverError);
	});

	/**
	 * Add a queueItem by printJobId and printerId -> port
	 */
	routes.post('/queue', (req, res) => {

		assert(req.body);
		assert(req.body.printJob, 'printJob is a required parameter');
		assert(req.body.port, 'port is a required parameter');

		console.log('queue', req.body.printJob);

		db.PrintJob
			.findOne({ id: req.body.printJob, createdBy: req.user.id })
			.populate('files')
			.populate('materials')
			.populate('sliceProfile')
			.populate('printer')
			.then((printJob) => {

				if (!printJob)
					return res.notFound('Printjob not found');

				db.QueueItem
					.create({
						origin:		'local',
						gcode:		printJob.gcode,
						printJob:	printJob.toObject(),
						port:		req.body.port,
						status:     'queued'
					})
					.then((queueItem) => {
						return res.ok({ message: "Printjob added to queue", queueItem });
					})
					.catch(res.serverError);
		})
		.catch(res.serverError);
	});

	/**
	 * Delete a queueItem
	 */
	routes.delete('/queue/:id', (req, res) => {
		db.QueueItem
			.findOne({ id: req.params.id })
			.then((queueItem) => {

				// delete file from storage when coming from cloud
				if (queueItem.origin === 'cloud' || queueItem.printJob.sliceMethod === 'custom') {
					const filePath = path.join(FormideClient.config.get('app.storageDir'), FormideClient.config.get('paths.gcode'), queueItem.gcode);

					try {
						fs.unlinkSync(filePath);
					}
					catch (e) {
						FormideClient.log.warn('file could not be deleted from storage');
					}
				}

				// delete from database
				queueItem.destroy(function (err) {
					if (err) return res.serverError(err);

					// When queueItem was custom printjob and uploaded locally, remove it from printjobs as well
					if (queueItem.origin === 'local' && queueItem.printJob.sliceMethod === 'custom')
						db.PrintJob.destroy({ id: queueItem.printJob.id }, function (err) {
							if (err) return res.serverError(err);
							return res.ok({ message: "queueItem and printJob deleted" });
						});
					else
						return res.ok({ message: "queueItem deleted" });
				});
		})
		.catch(res.serverError);
	});
};
