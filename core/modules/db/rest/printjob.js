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
		db.PrintJob
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.populate('printer')
		.populate('sliceProfile')
		.populate('materials')
		.populate('files')
/*
		.skip(req.pagination.offset)
		.limit(req.pagination.limit)
*/
		.exec(function (err, printJobs) {
			if (err) return res.serverError(err);
			return res.ok(printJobs);
		});
	});

	/*
	 * Get single printjob database object
	 */
	routes.get('/printjobs/:id', function(req, res) {
		db.PrintJob
		.find({ createdBy: req.user.id, id: req.params.id })
		.populate('printer')
		.populate('sliceProfile')
		.populate('materials')
		.populate('files')
		.exec(function (err, printJob) {
			if (err) return res.serverError(err);
			return res.ok(printJob);
		});
	});

	/*
	 * Add a custom printjob from own gcodefile upload
	 */
	routes.post('/printjobs', function(req, res) {
		db.PrintJob.create({
			sliceMethod: "custom",
			sliceFinished: true,
			gcode: req.body.gcodeHash,
			files: [ req.body.gcodeID ],
			createdBy: req.user.id
		}, function (err, printJob) {
			if (err) return res.serverError(err);
			if (!printJob) return res.notFound();
			return res.ok({
				message: "Printjob created from custom gcode file",
				prinjob: printJob
			});
		});
	});

	/*
	 * Delete printjob
	 */
	routes.delete('/printjobs/:id', function(req, res) {
		db.PrintJob.destroy({ id: req.params.id, createdBy: req.user.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "Printjob deleted"
			});
		});
	});
};
