/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

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
		db.PrintJob
		.create({
			sliceMethod:	"custom",
			sliceFinished:	true,
			gcode:			req.body.gcodeHash,		// TODO: make better
			files:			[ req.body.gcodeId ],	// TODO: make better
			createdBy:		req.user.id
		})
		.then((printJob) => {
			return res.ok({ message: "Printjob created from custom gcode", printJob: printJob });
		})
		.error(res.serverError);
	});

	/**
	 * Delete a printJob
	 */
	routes.delete('/printjobs/:id', function(req, res) {
		db.PrintJob
		.destroy({ id: req.params.id, createdBy: req.user.id })
		.then(() => {
			return res.ok({ message: "Printjob deleted" });
		})
		.error(res.serverError);
	});
};
