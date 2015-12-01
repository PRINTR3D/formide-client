/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, db) => {

	/**
	 * Get a list of sliceProfiles
	 */
	routes.get('/sliceprofiles', (req, res) => {
		db.SliceProfile
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.then(res.ok)
		.error(res.serverError);
	});

	/**
	 * Get a single sliceProfile
	 */
	routes.get('/sliceprofiles/:id', (req, res) => {
		db.SliceProfile
		.findOne({ createdBy: req.user.id, id: req.params.id })
		.then((sliceProfile) => {
			if (!sliceProfile) return res.notFound();
			return res.ok(sliceProfile);
		});
	});

	/**
	 * Create a new sliceProfile
	 */
	routes.post('/sliceprofiles', (req, res) => {
		db.SliceProfile
		.create({
			createdBy:	req.user.id,
			name:		req.body.name,
			settings:	req.body.settings // TODO: check with formide-tools
		})
		.then((sliceProfile) => {
			return res.ok({ message: 'Sliceprofile created', sliceProfile });
		})
		.error(res.serverError);
	});

	/**
	 * Update a sliceProfile
	 */
	routes.put('/sliceprofiles/:id', (req, res) => {
		db.SliceProfile
		.update({ id: req.params.id, createdBy: req.user.id }, {
			user:		req.user.id,
			name:		req.body.name,
			settings:	req.body.settings
		})
		.then((updated) => {
			return res.ok({ message: "Sliceprofile updated", sliceProfile: updated[0] });
		})
		.error(res.serverError);
	});

	/**
	 * Delete a sliceProfile
	 */
	routes.delete('/sliceprofiles/:id', (req, res) => {
		db.SliceProfile
		.destroy({ id: req.params.id, createdBy: user.req.id })
		.then(() => {
			return res.ok({ message: "Sliceprofile deleted" });
		})
		.error(res.serverError);
	});
};
