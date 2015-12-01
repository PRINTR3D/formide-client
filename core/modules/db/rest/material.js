/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	/*
	 * Get a list of material objects
	 */
	routes.get('/materials', (req, res) => {
		db.Material
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.populate('createdBy')
		.then(res.ok)
		.error(res.serverError);
	});

	/*
	 * Get a single material object
	 */
	routes.get('/materials/:id', (req, res) => {
		db.Material
		.findOne({ createdBy: req.user.id, id: req.params.id })
		.populate('createdBy')
		.then((material) => {
			if (!material) return res.notFound();
			return res.ok(material);
		})
		.error(res.serverError);
	});

	/*
	 * Create a new material object. req.body should contain all items in material database object
	 */
	routes.post('/materials', function(req, res) {
		db.Material.create({
			name: req.body.name,
			type: req.body.type,
			filamentDiameter: req.body.filamentDiameter,
			temperature: req.body.temperature,
			firstLayersTemperature: req.body.firstLayersTemperature,
			bedTemperature: req.body.bedTemperature,
			firstLayersBedTemperature: req.body.firstLayersBedTemperature,
			feedRate: req.body.feedRate,
			createdBy: req.user.id
		}, function (err, material) {
			if (err) return res.serverError(err.message);
			return res.ok({ message: "Material created", material: material });
		});
	});

	/*
	 * Update a material object. req.body should contain all items in material database object
	 */
	routes.put('/materials/:id', function(req, res) {
		db.Material.update({ id: req.params.id, createdBy: req.user.id }, {
			name: req.body.name,
			type: req.body.type,
			filamentDiameter: req.body.filamentDiameter,
			temperature: req.body.temperature,
			firstLayersTemperature: req.body.firstLayersTemperature,
			bedTemperature: req.body.bedTemperature,
			firstLayersBedTemperature: req.body.firstLayersBedTemperature,
			feedRate: req.body.feedRate
		}, function (err, updated) {
			if (err) return res.serverError(err.message);
			return res.ok({ message: "Material updated", material: updated[0] });
		});
	});

	/*
	 * Delete material object
	 */
	routes.delete('/materials/:id', function(req, res) {
		db.Material.destroy({ createdBy: req.user.id, id: req.params.id }, function (err) {
			if (err) return res.serverError(err.message);
			return res.ok({ message: "Material deleted" });
		});
	});
};
