/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
 */

module.exports = function(routes, db)
{
	routes.get('/materials', FormideOS.manager('core.http').server.permissions.check('rest:material'), function( req, res ) {
		db.Material.find().exec(function(err, materials) {
			res.send(materials);
		});
	});

	routes.get('/materials/:id', FormideOS.manager('core.http').server.permissions.check('rest:material'), function( req, res ) {
		req.checkParams('id', 'id invalid').notEmpty().isInt();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}
		
		db.Material.findOne({ _id: req.params.id }).exec(function(err, material) {
			res.send(material);
		});
	});

	routes.post('/materials', FormideOS.manager('core.http').server.permissions.check('rest:material'), function( req, res )
	{
		req.checkBody('name', 'name invalid').notEmpty();
		req.checkBody('type', 'type invalid').notEmpty();
		req.checkBody('filamentDiameter', 'filamentDiameter invalid').notEmpty().isInt();
		req.checkBody('temperature', 'temperature invalid').notEmpty().isInt();
		req.checkBody('firstLayersTemperature', 'firstLayersTemperature invalid').notEmpty().isInt();
		req.checkBody('bedTemperature', 'bedTemperature invalid').notEmpty().isInt();
		req.checkBody('firstLayersBedTemperature', 'firstLayersBedTemperature invalid').notEmpty().isInt();
		req.checkBody('feedrate', 'feedrate invalid').notEmpty().isInt();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Material
		.create(req.body)
		.success(function()
		{
			return res.send({
				status: 200,
				message: 'OK'
			});
		});
	});

	routes.put('/materials/:id', FormideOS.manager('core.http').server.permissions.check('rest:material'), function( req, res )
	{
		req.checkParams('id', 'id invalid').notEmpty().isInt();
		req.checkBody('name', 'name invalid').notEmpty();
		req.checkBody('type', 'type invalid').notEmpty();
		req.checkBody('filamentDiameter', 'filamentDiameter invalid').notEmpty().isInt();
		req.checkBody('temperature', 'temperature invalid').notEmpty().isInt();
		req.checkBody('firstLayersTemperature', 'firstLayersTemperature invalid').notEmpty().isInt();
		req.checkBody('bedTemperature', 'bedTemperature invalid').notEmpty().isInt();
		req.checkBody('firstLayersBedTemperature', 'firstLayersBedTemperature invalid').notEmpty().isInt();
		req.checkBody('feedrate', 'feedrate invalid').notEmpty().isInt();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Material
		.find({ where: {id: req.params.id } })
		.on('success', function( material )
		{
			if(material)
			{
				material
				.updateAttributes(req.body)
				.success(function()
				{
					return res.send({
						status: 200,
						message: 'OK'
					});
				});
			}
		});
	});

	routes.delete('/materials/:id', FormideOS.manager('core.http').server.permissions.check('rest:material'), function( req, res )
	{
		req.checkParams('id', 'id invalid').notEmpty().isInt();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Material
		.find({ where: {id: req.params.id } })
		.on('success', function( material )
		{
			if(material)
			{
				material
				.destroy()
				.success(function()
				{
					return res.send({
						status: 200,
						message: 'OK'
					});
				});
			}
		});
	});
};