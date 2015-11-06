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
		db.Sliceprofile.find().exec(function(err, sliceprofiles) {
			if (err) return res.send(err);
			return res.send(sliceprofiles);
		});
	});

	/*
	 * Get a single sliceprofile object
	 */
	routes.get('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.findOne({ _id: req.params.id }).exec(function(err, sliceprofile) {
			if (err) return res.send(err);
			return res.send(sliceprofile);
		});
	});

	/*
	 * Create a new sliceprofile object. req.body should contain all items in sliceprofile database object
	 */
	routes.post('/sliceprofiles', function(req, res) {
		db.Sliceprofile.create(req.body, function(err, sliceprofile) {
			if (err) return res.status(400).send(err);
			if (sliceprofile) {
				return res.send({
					sliceprofile: sliceprofile,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	/*
	 * Update a sliceprofile object. req.body should contain all items in sliceprofile database object
	 */
	routes.put('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.update({ _id: req.params.id }, req.body, function(err, sliceprofile) {
			if (err) return res.status(400).send(err);
			if (sliceprofile) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	/*
	 * Delete sliceprofile object
	 */
	routes.delete('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.remove({ _id: req.params.id }, function(err, sliceprofile) {
			if (err) return res.status(400).send(err);
			if (sliceprofile) {
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