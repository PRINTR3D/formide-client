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
	routes.get('/materials', function( req, res )
	{
		db.Material
		.findAll()
		.then(function( materials )
		{
			res.send( materials );
		});
	});

	routes.get('/materials/:id', function( req, res )
	{
		db.Material
		.find({ where: {id: req.params.id } })
		.then(function( material )
		{
			res.send( material );
		});
	});

	routes.post('/materials', function( req, res )
	{
		db.Material
		.create(req.payload)
		.success(function()
		{
			res.send('OK')
		});
	});

	routes.put('/materials/:id', function( req, res )
	{
		db.Material
		.find({ where: {id: req.params.id } })
		.on('success', function( material )
		{
			if(material)
			{
				material
				.updateAttributes(req.payload)
				.success(function()
				{
					res.send('OK');
				});
			}
		});
	});

	routes.delete('/materials/:id', function( req, res )
	{
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
					res.send('OK');
				});
			}
		});
	});
};