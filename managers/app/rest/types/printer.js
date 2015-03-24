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
	routes.get('/printers', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function( req, res )
	{
		db.Printer
		.findAll()
		.then(function(printers)
		{
			res.send(printers);
		});
	});

	routes.get('/printers/:id', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function( req, res )
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

		db.Printer
		.find({ where: {id: req.params.id } })
		.then(function(printer)
		{
			res.send(printer);
		});
	});

	routes.post('/printers', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function( req, res )
	{
		req.checkBody('name', 'name invalid').notEmpty();
		req.checkBody('buildVolumeX', 'buildVolumeX invalid').notEmpty().isInt();
		req.checkBody('buildVolumeY', 'buildVolumeY invalid').notEmpty().isInt();
		req.checkBody('buildVolumeZ', 'buildVolumeZ invalid').notEmpty().isInt();
		req.checkBody('bed', 'bed invalid').notEmpty();
		req.checkBody('extruders', 'name invalid').notEmpty();
		req.checkBody('port', 'name invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Printer
		.create(req.body)
		.success(function()
		{
			return res.send({
				status: 200,
				message: 'OK'
			});
		});
	});

	routes.put('/printers/:id', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function( req, res )
	{
		req.checkParams('id', 'id invalid').notEmpty().isInt();
		req.checkBody('name', 'name invalid').notEmpty();
		req.checkBody('buildVolumeX', 'buildVolumeX invalid').notEmpty().isInt();
		req.checkBody('buildVolumeY', 'buildVolumeY invalid').notEmpty().isInt();
		req.checkBody('buildVolumeZ', 'buildVolumeZ invalid').notEmpty().isInt();
		req.checkBody('bed', 'bed invalid').notEmpty();
		req.checkBody('extruders', 'name invalid').notEmpty();
		req.checkBody('port', 'name invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Printer
		.find({ where: {id: req.params.id } })
		.on('success', function( printer )
		{
			if(printer)
			{
				printer
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

	routes.delete('/printers/:id', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function( req, res )
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

		db.Printer
		.find({ where: {id: req.params.id } })
		.on('success', function( printer )
		{
			if(printer)
			{
				printer
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