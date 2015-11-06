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
		db.Printjob
		.find({ user: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.populate('printer')
		.populate('sliceprofile')
		.populate('materials')
		.populate('files')
/*
		.skip(req.pagination.offset)
		.limit(req.pagination.limit)
*/
		.exec(function (err, printjobs) {
			if (err) return res.serverError(err);
			return res.ok(printjobs);
		});
	});

	/*
	 * Get single printjob database object
	 */
	routes.get('/printjobs/:id', function(req, res) {
		db.Printjob
		.find({ user: req.user.id, id: req.params.id })
		.populate('printer')
		.populate('sliceprofile')
		.populate('materials')
		.populate('files')
		.exec(function (err, printjob) {
			if (err) return res.serverError(err);
			return res.ok(printjob);
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
			files: [ req.body.gcodeID ],
			user: req.user.id
		}, function (err, printjob) {
			if (err) return res.serverError(err);
			if (!printjob) return res.notFound();
			return res.ok({
				message: "Printjob created from custom gcode file",
				prinjob: printjob
			});
		});
	});

	/*
	 * Delete printjob
	 */
	routes.delete('/printjobs/:id', function(req, res) {
		db.Printjob.destroy({ id: req.params.id, user: req.user.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "Printjob deleted"
			});
		});
	});
};