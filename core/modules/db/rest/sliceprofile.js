/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	routes.get('/sliceprofiles', function(req, res) {
		db.Sliceprofile.find().exec(function(err, sliceprofiles) {
			if (err) return res.send(err);
			return res.send(sliceprofiles);
		});
	});

	routes.get('/sliceprofiles/:id', function(req, res) {
		db.Sliceprofile.findOne({ _id: req.params.id }).exec(function(err, sliceprofile) {
			if (err) return res.send(err);
			return res.send(sliceprofile);
		});
	});

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