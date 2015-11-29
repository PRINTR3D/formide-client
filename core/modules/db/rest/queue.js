/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db) {

	/*
	 * Get print queue for all printers or a specific printer by port
	 */
	routes.get('/queue', function(req, res) {
		if (req.query.port) {
			db.QueueItem
			.find({ port: req.query.port })
			.exec(function (err, queueItems) {
				if (err) return res.serverError(err);
				return res.ok(queueItems);
			});
		}
		else {
			db.QueueItem
			.find()
			.exec(function (err, queueItems) {
				if (err) return res.serverError(err);
				return res.ok(queueItems);
			});
		}
	});

	/*
	 * Get a single queue item from database
	 */
	routes.get('/queue/:id', function(req, res) {
		db.QueueItem
		.findOne({ id: req.params.id })
		.exec(function (err, queueItem) {
			if (err) return res.serverError(err);
			return res.ok(queueItem);
		});
	});

	/*
	 * Add a queue item by printjobID and printerID (adds the printjob to the print queue of that printer)
	 */
	routes.post('/queue/:printjobId/:printerId', function(req, res) {
		db.PrintJob
		.findOne({ id: req.params.printjobId, createdBy: req.user.id })
		.populate('files')
		.populate('materials')
		.populate('sliceprofile')
		.populate('printer')
		.exec(function (err, printJob) {
			if (err) return res.serverError(err);
			db.Printer
			.findOne({ id: req.params.printerId })
			.exec(function (err, printer) {
				if (err) return res.serverError(err);

				db.QueueItem.create({
					origin: "local",
					gcode: printjob.gcode,
					printJob: printJob.toObject(),
					port: printer.port
				}, function (err, queueItem) {
					if (err) return res.serverError(err);
					return res.ok({
						message: "Printjob added to queue",
						queueItem: queueItem
					});
				})
			})
		});
	});

	/*
	 * Delete queue item
	 */
	routes.delete('/queue/:id', function(req, res) {
		db.QueueItem.destroy({ id: req.params.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "Queue item deleted"
			});
		});
	});
};
