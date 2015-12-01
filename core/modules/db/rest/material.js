/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, db) => {

	/**
	 * Get a list of materials
	 */
	routes.get('/materials', (req, res) => {
		db.Material
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.populate('createdBy')
		.then(res.ok)
		.error(res.serverError);
	});

	/**
	 * Get a single material
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

	/**
	 * Create a new material
	 */
	routes.post('/materials', (req, res) => {
		db.Material
		.create({
			name:						req.body.name,
			type:						req.body.type,
			filamentDiameter:			req.body.filamentDiameter,
			temperature:				req.body.temperature,
			firstLayersTemperature:		req.body.firstLayersTemperature,
			bedTemperature:				req.body.bedTemperature,
			firstLayersBedTemperature:	req.body.firstLayersBedTemperature,
			feedRate:					req.body.feedRate,
			createdBy:					req.user.id
		})
		.then((material) => {
			return res.ok({ message: "Material created", material });
		})
		.error(res.serverError);
	});

	/**
	 * Update a material
	 */
	routes.put('/materials/:id', (req, res) => {
		db.Material
		.update({ id: req.params.id, createdBy: req.user.id }, {
			name:						req.body.name,
			type:						req.body.type,
			filamentDiameter:			req.body.filamentDiameter,
			temperature:				req.body.temperature,
			firstLayersTemperature:		req.body.firstLayersTemperature,
			bedTemperature:				req.body.bedTemperature,
			firstLayersBedTemperature:	req.body.firstLayersBedTemperature,
			feedRate:					req.body.feedRate
		})
		.then((updated) => {
			return res.ok({ message: "Material updated", material: updated[0] });
		})
		.error(res.serverError);
	});

	/**
	 * Delete a material
	 */
	routes.delete('/materials/:id', (req, res) => {
		db.Material
		.destroy({ createdBy: req.user.id, id: req.params.id })
		.then(() => {
			return res.ok({ message: "Material deleted" });
		})
		.error(res.serverError);
	});
};
