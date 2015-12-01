/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, db) => {

	/**
	 * Get all queueItems or for a single printer
	 */
	routes.get('/queue', (req, res) => {
		db.QueueItem
		.find({ port: ((req.query.port) ? req.query.port : null) })
		.then(res.ok)
		.error(res.serverError);
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
		.error(res.serverError);
	});

	/**
	 * Add a queueItem by printJobId and printerId -> port
	 */
	routes.post('/queue/:printjobId/:printerId', (req, res) => {
		db.PrintJob
		.findOne({ id: req.params.printjobId, createdBy: req.user.id })
		.populate('files')
		.populate('materials')
		.populate('sliceProfile')
		.populate('printer')
		.then((printJob) => {
			db.Printer
			.findOne({ id: req.params.printerId })
			.then((printer) => {
				db.QueueItem
				.create({
					origin:		'local',
					gcode:		printJob.gcode,
					printJob:	printJob.toObject(),
					port:		printer.port
				})
				.then((queueItem) => {
					return res.ok({ message: "Printjob added to queue", queueItem });
				})
				.error(res.serverError);
			})
			.error(res.serverError);
		})
		.error(res.serverError);
	});

	/**
	 * Delete a queueItem
	 */
	routes.delete('/queue/:id', (req, res) => {
		db.QueueItem
		.destroy({ id: req.params.id })
		.then(() => {
			return res.ok({ message: "Queueitem deleted" });
		})
		.error(res.serverError);
	});
};
