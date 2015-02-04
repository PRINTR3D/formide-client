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
			path: '/api/printers',
			handler: function(req, res)
			{
				db.Printer
				.findAll()
				.then(function(printers)
				{
					res(printers);
				});
			}
		},
		{
			method: 'GET',
			path: '/api/printers/{id}',
			handler: function(req, res)
			{
				db.Printer
				.find({ id: req.params.id })
				.then(function(printer)
				{
					res(printer);
				});
			}
		}
	]);
};