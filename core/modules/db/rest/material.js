/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	routes.get('/materials', FormideOS.http.permissions.check('db:material:read'), function( req, res ) {
		db.Material.find().exec(function(err, materials) {
			if (err) return res.send(err);
			return res.send(materials);
		});
	});

	routes.get('/materials/:id', FormideOS.http.permissions.check('db:material:read'), function( req, res ) {
		db.Material.findOne({ _id: req.params.id }).exec(function(err, material) {
			if (err) return res.send(err);
			return res.send(material);
		});
	});

	routes.post('/materials', FormideOS.http.permissions.check('db:material:write'), function(req, res) {
		db.Material.create(req.body, function(err, material) {
			if (err) return res.status(400).send(err);
			if (material) {
				return res.send({
					material: material,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.put('/materials/:id', FormideOS.http.permissions.check('db:material:write'), function(req, res) {
		db.Material.update({ _id: req.params.id }, req.body, function(err, material) {
			if (err) return res.status(400).send(err);
			if (material) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.delete('/materials/:id', FormideOS.http.permissions.check('db:material:write'), function(req, res) {
		db.Material.remove({ _id: req.params.id }, function(err, material) {
			if (err) return res.status(400).send(err);
			if (material) {
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