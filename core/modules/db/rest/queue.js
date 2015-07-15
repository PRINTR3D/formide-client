/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db) {
	
	routes.get('/queue', FormideOS.http.permissions.check('db:queue:read'), function(req, res) {
		db.Queueitem.find().populate('printjob printer').deepPopulate('printjob.modelfiles printjob.materials printjob.sliceprofile printjob.printer printjob.gcodefile').exec(function(err, queue) {
			if (err) return res.send(err);
			return res.send(queue);
		});
	});

	routes.get('/queue/:id', FormideOS.http.permissions.check('db:queue:read'), function(req, res) {
		db.Queueitem.findOne({ _id: req.params.id }).populate('printjob printer').deepPopulate('printjob.modelfiles printjob.materials printjob.sliceprofile printjob.printer printjob.gcodefile').exec(function(err, queueitem) {
			if (err) return res.send(err);
			return res.send(queueitem);
		});
	});

	routes.post('/queue/:printjobID/:printerID', FormideOS.http.permissions.check('db:queue:write'), function(req, res) {
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

	routes.delete('/queue/:id', FormideOS.http.permissions.check('db:queue:write'), function(req, res) {
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