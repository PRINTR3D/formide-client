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
		db.SliceProfile
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
/*
		.skip(req.pagination.offset)
		.limit(req.pagination.limit)
*/
		.exec(function (err, sliceProfiles) {
			if (err) return res.serverError(err);
			return res.ok(sliceProfiles);
		});
	});

	/*
	 * Get a single sliceprofile object
	 */
	routes.get('/sliceprofiles/:id', function(req, res) {
		db.SliceProfile.findOne({ createdBy: req.user.id, id: req.params.id }, function (err, sliceProfile) {
			if (err) return res.serverError(err);
			if (!sliceProfile) return res.notFound();
			return res.ok(sliceProfile);
		});
	});

	/*
	 * Create a new sliceprofile object. req.body should contain all items in sliceprofile database object
	 */
	routes.post('/sliceprofiles', function(req, res) {
		db.SliceProfile.create({
			createdBy: req.user.id,
			name: req.body.name,
			settings: req.body.settings
		}, function (err, sliceProfile) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Sliceprofile created", sliceProfile: sliceProfile });
		});
	});

	/*
	 * Update a sliceprofile object. req.body should contain all items in sliceprofile database object
	 */
	routes.put('/sliceprofiles/:id', function(req, res) {
		db.SliceProfile.update({ id: req.params.id, createdBy: req.user.id }, {
			user: req.user.id,
			name: req.body.name,
			settings: req.body.settings
		}, function (err, updated) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Sliceprofile updated", sliceProfile: updated[0] });
		});
	});

	/*
	 * Delete sliceprofile object
	 */
	routes.delete('/sliceprofiles/:id', function(req, res) {
		db.SliceProfile.destroy({ id: req.params.id, createdBy: user.req.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Sliceprofile deleted" });
		});
	});
};
