/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
 */

module.exports = function(routes, db) {
	
	routes.get('/queue', function(req, res) {
		db.Queueitem.find().populate('printjob').deepPopulate('printjob.modelfiles printjob.materials printjob.sliceprofile printjob.printer').exec(function(err, queue) {
			if (err) return res.send(err);
			return res.send(queue);
		});
	});

	routes.get('/queue/:id', function(req, res) {
		db.Queueitem.findOne({ _id: req.params.id }).populate('printjob').deepPopulate('printjob.modelfiles printjob.materials printjob.sliceprofile printjob.printer').exec(function(err, queueitem) {
			if (err) return res.send(err);
			return res.send(queueitem);
		});
	});

	routes.post('/queue/:printjobID', function(req, res) {
		db.Printjob.findOne({ _id: req.params.printjobID }, function(err, printjob) {
			db.Queueitem.create({
				origin: 'local',
				status: 'queued',
				gcode: printjob.gcode,
				printjob: printjob._id
			}, function(err, queueitem) {
				if (err) return res.send(err);
				return res.send({
					success: true,
					queueitem: queueitem
				})
			});
		});
	});

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