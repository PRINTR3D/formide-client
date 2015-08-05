/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	/*
	 * Get a list of printjobs from database and populate with connected resources
	 */
	routes.get('/printjobs', function(req, res) {
		db.Printjob.find().populate('materials modelfiles gcodefile printer sliceprofile').exec(function(err, printjobs) {
			if (err) return res.send(err);
			return res.send(printjobs);
		});
	});

	/*
	 * Get single printjob database object
	 */
	routes.get('/printjobs/:id', function(req, res) {
		db.Printjob.findOne({ _id: req.params.id }).populate('materials modelfiles gcodefile printer sliceprofile').exec(function(err, printjob) {
			if (err) return res.send(err);
			return res.send(printjob);
		});
	});
	
	/*
	 * Add a custom printjob from own gcodefile upload
	 */
	routes.post('/printjobs', function(req, res) {
		db.Printjob.create({
				sliceMethod: "custom",
				sliceFinished: true,
				gcode: req.body.gcodeHash,
				gcodefile: req.body.gcodeID
			}, function(err, printjob) {
			if (err) return res.status(400).send(err);
			if (printjob) {
				return res.send({
					printjob: printjob,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	/*
	 * Delete printjob
	 */
	routes.delete('/printjobs/:id', function(req, res) {
		db.Printjob.remove({ _id: req.params.id }, function(err, printjob) {
			if (err) return res.status(400).send(err);
			return res.send({ success: true });
		});
	});
};