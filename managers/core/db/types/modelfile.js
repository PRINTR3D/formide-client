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
	routes.get('/modelfiles', function( req, res )
	{
		db.Modelfile
		.findAll()
		.then(function(modelfiles)
		{
			res.send(modelfiles);
		});
	});

	routes.get('/modelfiles/:id', function( req, res )
	{
		db.Modelfile
		.find({ where: {id: req.params.id } })
		.then(function(modelfile)
		{
			res.send(modelfile);
		});
	});

	routes.delete('/modelfiles/:id', function( req, res )
	{
		db.Modelfile
		.find({ where: {id: req.params.id } })
		.on('success', function( modelfile )
		{
			if(modelfile)
			{
				modelfile
				.destroy()
				.success(function()
				{
					res.send('OK');
				});
			}
		});
	});
};