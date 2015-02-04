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
			path: '/api/materials',
			handler: function(req, res)
			{
				db.Material
				.findAll()
				.then(function(materials)
				{
					res(materials);
				});
			}
		},
		{
			method: 'GET',
			path: '/api/materials/{id}',
			handler: function(req, res)
			{
				db.Material
				.find({ id: req.params.id })
				.then(function(material)
				{
					res(material);
				});
			}
		}
	]);
};