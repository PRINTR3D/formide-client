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
	routes.get('/users', function( req, res )
	{
		db.User
		.findAll()
		.then(function(users)
		{
			res.send(users);
		});
	});

	routes.get('/users/:id', function( req, res )
	{
		db.User
		.find({ where: {id: req.params.id } })
		.then(function(user)
		{
			res.send(user);
		});
	});

	routes.post('/users', function( req, res )
	{
		db.User
		.create(req.payload)
		.success(function()
		{
			res.send('OK')
		});
	});

	routes.put('/users/:id', function( req, res )
	{
		db.User
		.find({ where: {id: req.params.id } })
		.on('success', function( user )
		{
			if(user)
			{
				user
				.updateAttributes(req.payload)
				.success(function()
				{
					res.send('OK');
				});
			}
		});
	});

	routes.delete('/users/:id', function( req, res )
	{
		db.User
		.find({ where: {id: req.params.id } })
		.on('success', function( user )
		{
			if(user)
			{
				user
				.destroy()
				.success(function()
				{
					res.send('OK');
				});
			}
		});
	});
};