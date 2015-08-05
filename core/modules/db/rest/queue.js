/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db) {
	
	/*
	 * Get print queue for all printers. Front-end has to filter on a specific printer if wanted.
	 */
	routes.get('/queue', function(req, res) {
		db.Queueitem.find().populate('printjob printer').deepPopulate('printjob.modelfiles printjob.materials printjob.sliceprofile printjob.printer printjob.gcodefile').exec(function(err, queue) {
			if (err) return res.send(err);
			return res.send(queue);
		});
	});

	/*
	 * Get a single queue item from database
	 */
	routes.get('/queue/:id', function(req, res) {
		db.Queueitem.findOne({ _id: req.params.id }).populate('printjob printer').deepPopulate('printjob.modelfiles printjob.materials printjob.sliceprofile printjob.printer printjob.gcodefile').exec(function(err, queueitem) {
			if (err) return res.send(err);
			return res.send(queueitem);
		});
	});

	/*
	 * Add a queue item by printjobID and printerID (adds the printjob to the print queue of that printer)
	 */
	routes.post('/queue/:printjobID/:printerID', function(req, res) {
		db.Printjob.findOne({ _id: req.params.printjobID }, function(err, printjob) {
			if (err) return res.json({ success: false, err: err, message: 'printjob error' });
			db.Printer.findOne({ _id: req.params.printerID }, function(err, printer) {
				if (err) return res.json({ success: false, err: err, message: 'printer error' });
				if (!printer) return res.json({ success: false, message: 'no printer found with this ID' });
				db.Queueitem.create({
					origin: 'local',
					status: 'queued',
					gcode: printjob.gcode,
					printjob: printjob._id,
					printer: req.params.printerID
				}, function(err, queueitem) {
					if (err) return res.send(err);
					return res.send({
						success: true,
						queueitem: queueitem
					});
				});
			});
		});
	});

	/*
	 * Delete queue item
	 */
	routes.delete('/queue/:id', function(req, res) {
		db.Queueitem.remove({ _id: req.params.id }, function(err, queueitem) {
			if (err) return res.status(400).send(err);
			if (queueitem) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});
};