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
	routes.get('/users', FormideOS.manager('core.http').server.permissions.check('rest:user'), function( req, res ) {
		db.User.find().exec(function(err, users) {
			res.send(users);
		});
	});

	routes.get('/users/:id', FormideOS.manager('core.http').server.permissions.check('rest:user'), function( req, res ) {
		db.User.findOne({ _id: req.params.id }).exec(function(err, user) {
			res.send(user);
		});
	});

	routes.post('/users', FormideOS.manager('core.http').server.permissions.check('rest:user'), function( req, res )
	{
		db.User
		.create(req.body)
		.success(function()
		{
			res.send('OK')
		});
	});

	routes.put('/users/:id', FormideOS.manager('core.http').server.permissions.check('rest:user'), function( req, res )
	{
		db.User
		.find({ where: {id: req.params.id } })
		.on('success', function( user )
		{
			if(user)
			{
				user
				.updateAttributes(req.body)
				.success(function()
				{
					res.send('OK');
				});
			}
		});
	});

	routes.delete('/users/:id', FormideOS.manager('core.http').server.permissions.check('rest:user'), function( req, res )
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