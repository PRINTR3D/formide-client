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
			path: '/api/modelfiles',
			config: {
	            auth: 'session'
	        },
			handler: function(req, res)
			{
				db.Modelfile
				.findAll()
				.then(function(modelfiles)
				{
					res(modelfiles);
				});
			}
		},
		{
			method: 'GET',
			path: '/api/modelfiles/{id}',
			config: {
	            auth: 'session'
	        },
			handler: function(req, res)
			{
				db.Modelfile
				.find({ where: {id: req.params.id } })
				.then(function(modelfile)
				{
					res(modelfile);
				});
			}
		},
		{
			method: 'DELETE',
			path: '/api/modelfiles/{id}',
			config: {
	            auth: 'session'
	        },
			handler: function(req, res)
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
							res('OK');
						});
					}
				});
			}
		}
	]);
};