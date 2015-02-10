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
			config: {
	            auth: 'session'
	        },
			handler: function(req, res)
			{
				Printspot.db.Queueitem
				.findAll({where: {status: 'queued'}, include: [{model: Printspot.db.Printjob, include: [{model: Printspot.db.Modelfile}]}]})
				.success(function(queue)
				{
					res(queue);
				});
			}
		},
		{
			method: 'GET',
			path: '/api/queue/{id}',
			config: {
	            auth: 'session'
	        },
			handler: function(req, res)
			{
				db.Queueitem
				.find({ where: {id: req.params.id } })
				.then(function(queueitem)
				{
					res(queueitem);
				});
			}
		},
		{
			method: 'POST',
			path: '/api/queue',
			config: {
				auth: 'session'
			},
			handler: function(req, res)
			{
				if(req.payload.printjobID)
				{
					Printspot.db.Printjob.find({where: {id: req.payload.printjobID}})
					.success(function(printjob)
					{
						Printspot.db.Queueitem
						.create({
							origin: 'local',
							status: 'queued',
							gcode: printjob.gcode,
							PrintjobId: printjob.id
						})
						.success(function(queueitem)
						{
							res('OK');
						});
					});
				}
			}
		},
		{
			method: 'DELETE',
			path: '/api/queue/{id}',
			config: {
	            auth: 'session'
	        },
			handler: function(req, res)
			{
				db.Queueitem
				.find({ where: {id: req.params.id } })
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