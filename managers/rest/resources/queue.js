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
			path: '/api/queue',
			handler: function(req, res)
			{
				db.Queueitem
				.findAll()
				.then(function(queueitems)
				{
					res(queueitems);
				});
			}
		},
		{
			method: 'GET',
			path: '/api/queue/{id}',
			handler: function(req, res)
			{
				db.Queueitem
				.find({ id: req.params.id })
				.then(function(queueitem)
				{
					res(queueitem);
				});
			}
		},
		{
			method: 'DELETE',
			path: '/api/queue/{id}',
			handler: function(req, res)
			{
				db.Queueitem
				.find({ id: req.params.id })
				.on('success', function( queueitem )
				{
					if(queueitem)
					{
						queueitem
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