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
	routes.get('/printers', function( req, res )
	{
		db.Printer
		.findAll()
		.then(function(printers)
		{
			res.send(printers);
		});
	});

	routes.get('/printers/:id', function( req, res )
	{
		db.Printer
		.find({ where: {id: req.params.id } })
		.then(function(printer)
		{
			res.send(printer);
		});
	});

	routes.post('/printers', function( req, res )
	{
		db.Printer
		.create(req.payload)
		.success(function()
		{
			res.send('OK')
		});
	});

	routes.put('/printers/:id', function( req, res )
	{
		db.Printer
		.find({ where: {id: req.params.id } })
		.on('success', function( printer )
		{
			if(printer)
			{
				printer
				.updateAttributes(req.payload)
				.success(function()
				{
					res.send('OK');
				});
			}
		});
	});

	routes.delete('/printers/:id', function( req, res )
	{
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
					res.send('OK');
				});
			}
		});
	});
};