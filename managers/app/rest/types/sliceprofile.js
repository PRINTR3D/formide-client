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
	routes.get('/sliceprofiles', function( req, res )
	{
		db.Sliceprofile
		.findAll()
		.then(function(sliceprofiles)
		{
			res.send(sliceprofiles);
		});
	});

	routes.get('/sliceprofiles/:id', function( req, res )
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

		db.Sliceprofile
		.find({ where: {id: req.params.id } })
		.then(function(sliceprofile)
		{
			res.send(sliceprofile);
		});
	});

	routes.post('/sliceprofiles', function( req, res )
	{
		req.checkBody('name', 'name invalid').notEmpty();
		req.checkBody('settings', 'type invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Sliceprofile
		.create(req.body)
		.success(function()
		{
			return res.send({
				status: 200,
				message: 'OK'
			});
		});
	});

	routes.put('/sliceprofiles/:id', function( req, res )
	{
		req.checkParams('id', 'id invalid').notEmpty().isInt();
		req.checkBody('name', 'name invalid').notEmpty();
		req.checkBody('settings', 'type invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		db.Sliceprofile
		.find({ where: {id: req.params.id } })
		.on('success', function( sliceprofile )
		{
			if(sliceprofile)
			{
				sliceprofile
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

	routes.delete('/sliceprofiles/:id', function( req, res )
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

		db.Sliceprofile
		.find({ where: {id: req.params.id } })
		.on('success', function( sliceprofile )
		{
			if(sliceprofile)
			{
				sliceprofile
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