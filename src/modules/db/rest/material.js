/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, db) => {

	/**
	 * Get a list of materials
	 */
	routes.get('/materials', (req, res) => {
		db.Material
			.find({ or: [ { createdBy: req.user.id }, { preset: true } ] }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
			.sort('presetOrder ASC')
			.sort('createdAt DESC')
			.then(res.ok)
			.catch(res.serverError);
	});

	/**
	 * Get a single material
	 */
	routes.get('/materials/:id', (req, res) => {
		db.Material
			.findOne({ or: [ { createdBy: req.user.id }, { preset: true } ], id: req.params.id })
			.then((material) => {
				if (!material) return res.notFound();
				return res.ok(material);
			})
			.catch(res.serverError);
	});

	/**
	 * Create a new material
	 */
	routes.post('/materials', (req, res) => {
		db.Material
			.create({
				name:						req.body.name,
				type:						req.body.type,
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
			.catch(res.serverError);
	});

	/**
	 * Update a material
	 */
	routes.put('/materials/:id', (req, res) => {
		db.Material
			.update({ id: req.params.id, or: [ { createdBy: req.user.id }, { preset: true } ] }, {
				name:						req.body.name,
				type:						req.body.type,
				temperature:				req.body.temperature,
				firstLayersTemperature:		req.body.firstLayersTemperature,
				bedTemperature:				req.body.bedTemperature,
				firstLayersBedTemperature:	req.body.firstLayersBedTemperature,
				feedRate:					req.body.feedRate
			})
			.then((updated) => {
				return res.ok({ message: "Material updated", material: updated[0] });
			})
			.catch(res.serverError);
	});

	/**
	 * Delete a material
	 */
	routes.delete('/materials/:id', (req, res) => {
		db.Material
			.destroy({ id: req.params.id })
			.then(() => {
				return res.ok({ message: "Material deleted" });
			})
			.catch(res.serverError);
	});
};
