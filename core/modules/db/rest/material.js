/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	/*
	 * Get a list of material objects
	 */
	routes.get('/materials', function( req, res ) {
		db.Material.find().exec(function(err, materials) {
			if (err) return res.send(err);
			return res.send(materials);
		});
	});

	/*
	 * Get a single material object
	 */
	routes.get('/materials/:id', function( req, res ) {
		db.Material.findOne({ _id: req.params.id }).exec(function(err, material) {
			if (err) return res.send(err);
			return res.send(material);
		});
	});

	/*
	 * Create a new material object. req.body should contain all items in material database object
	 */
	routes.post('/materials', function(req, res) {
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

	/*
	 * Update a material object. req.body should contain all items in material database object
	 */
	routes.put('/materials/:id', function(req, res) {
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

	/*
	 * Delete material object
	 */
	routes.delete('/materials/:id', function(req, res) {
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