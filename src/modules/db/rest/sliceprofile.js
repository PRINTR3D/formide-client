/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, db) => {

	/**
	 * Get a list of sliceProfiles
	 */
	routes.get('/sliceprofiles', (req, res) => {
		db.SliceProfile
			.find({ or: [ { createdBy: req.user.id }, { preset: true } ] }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
			.sort('presetOrder ASC')
			.then(res.ok)
			.catch(res.serverError);
	});

	/**
	 * Get a single sliceProfile
	 */
	routes.get('/sliceprofiles/:id', (req, res) => {
		db.SliceProfile
			.findOne({ or: [ { createdBy: req.user.id }, { preset: true } ], id: req.params.id })
			.then((sliceProfile) => {
				if (!sliceProfile) return res.notFound();
				return res.ok(sliceProfile);
			})
			.catch(res.serverError);
	});

	/**
	 * Create a new sliceProfile
	 */
	routes.post('/sliceprofiles', (req, res) => {
		db.SliceProfile
			.create({
				createdBy:	req.user.id,
				name:		req.body.name,
				settings:	req.body.settings // TODO: check with katana-tools
			})
			.then((sliceProfile) => {
				return res.ok({ message: 'Sliceprofile created', sliceProfile });
			})
			.catch(res.serverError);
	});

	/**
	 * Update a sliceProfile
	 */
	routes.put('/sliceprofiles/:id', (req, res) => {
		db.SliceProfile
			.update({ id: req.params.id, or: [ { createdBy: req.user.id }, { preset: true } ] }, {
				user:		req.user.id,
				name:		req.body.name,
				settings:	req.body.settings
			})
			.then((updated) => {
				return res.ok({ message: "Sliceprofile updated", sliceProfile: updated[0] });
			})
			.catch(res.serverError);
	});

	/**
	 * Delete a sliceProfile
	 */
	routes.delete('/sliceprofiles/:id', (req, res) => {
		db.SliceProfile
			.destroy({ id: req.params.id, createdBy: req.user.id })
			.then(() => {
				return res.ok({ message: "Sliceprofile deleted" });
			})
			.catch(res.serverError);
	});
};
