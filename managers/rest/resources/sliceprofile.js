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

module.exports = function(db, server)
{
	server.route([
		{
			method: 'GET',
			path: '/api/sliceprofiles',
			handler: function(req, res)
			{
				db.Sliceprofile
				.findAll()
				.then(function(sliceprofiles)
				{
					res(sliceprofiles);
				});
			}
		},
		{
			method: 'GET',
			path: '/api/sliceprofiles/{id}',
			handler: function(req, res)
			{
				db.Sliceprofile
				.find({ where: {id: req.params.id } })
				.then(function(sliceprofile)
				{
					res(sliceprofile);
				});
			}
		},
		{
			method: 'POST',
			path: '/api/sliceprofiles',
			handler: function(req, res)
			{
				db.Sliceprofile
				.create(req.payload)
				.success(function()
				{
					res('OK')
				});
			}
		},
		{
			method: 'PUT',
			path: '/api/sliceprofiles/{id}',
			handler: function(req, res)
			{
				db.Sliceprofile
				.find({ where: {id: req.params.id } })
				.on('success', function( sliceprofile )
				{
					if(sliceprofile)
					{
						sliceprofile
						.updateAttributes(req.payload)
						.success(function()
						{
							res('OK');
						});
					}
				});
			}
		},
		{
			method: 'DELETE',
			path: '/api/sliceprofiles/{id}',
			handler: function(req, res)
			{
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
							res('OK');
						});
					}
				});
			}
		}
	]);
};