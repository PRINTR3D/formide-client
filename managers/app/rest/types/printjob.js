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
	routes.get('/printjobs', function( req, res )
	{
		db.Printjob
		.findAll({ include: [ { model: db.Modelfile } ] })
		.then(function(printjobs)
		{
			res.send(printjobs);
		});
	});

	routes.get('/printjobs/:id', function( req, res )
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

		db.Printjob
		.find({ where: {id: req.params.id }, include: [ { model: db.Modelfile } ] })
		.then(function(printjob)
		{
			res.send(printjob);
		});
	});

	routes.delete('/printjobs/:id', function( req, res )
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

		db.Printjob
		.find({ where: {id: req.params.id } })
		.on('success', function( printjob )
		{
			if(printjob)
			{
				printjob
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