/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	/*
	 * Get a list of sliceprofile objects
	 */
	routes.get('/sliceprofiles', function(req, res) {
		db.Sliceprofile
		.find({ user: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
/*
		.skip(req.pagination.offset)
		.limit(req.pagination.limit)
*/
		.exec(function (err, sliceprofiles) {
			if (err) return res.serverError(err);
			return res.ok(sliceprofiles);
		});
	});

	/*
	 * Get a single sliceprofile object
	 */
	routes.get('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.findOne({ user: req.user.id, id: req.params.id }, function (err, sliceprofile) {
			if (err) return res.serverError(err);
			if (!sliceprofile) return res.notFound();
			return res.ok(sliceprofile);
		});
	});

	/*
	 * Create a new sliceprofile object. req.body should contain all items in sliceprofile database object
	 */
	routes.post('/sliceprofiles', function(req, res) {
		db.Sliceprofile.create({
			user: req.user.id,
			name: req.body.name,
			settings: req.body.settings
		}, function (err, sliceprofile) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Sliceprofile created", sliceprofile: sliceprofile });
		});
	});

	/*
	 * Update a sliceprofile object. req.body should contain all items in sliceprofile database object
	 */
	routes.put('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.update({ id: req.params.id, user: req.user.id }, {
			user: req.user.id,
			name: req.body.name,
			settings: req.body.settings
		}, function (err, updated) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Sliceprofile updated", sliceprofile: updated[0] });
		});
	});

	/*
	 * Delete sliceprofile object
	 */
	routes.delete('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.destroy({ id: req.params.id, user: user.req.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Sliceprofile deleted" });
		});
	});
};