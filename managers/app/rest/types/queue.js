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
	routes.get('/queue', function( req, res )
	{
		db.Queueitem
		.findAll({where: {status: 'queued'}, include: [{model: db.Printjob, include: [{model: db.Modelfile}]}]})
		.success(function(queue)
		{
			res.send(queue);
		});
	});

	routes.get('/queue/:id', function( req, res )
	{
		db.Queueitem
		.find({ where: {id: req.params.id } })
		.then(function(queueitem)
		{
			res.send(queueitem);
		});
	});

	routes.post('/queue', function( req, res )
	{
		if(req.body.printjobID)
		{
			db.Printjob.find({where: {id: req.body.printjobID}})
			.success(function(printjob)
			{
				db.Queueitem
				.create({
					origin: 'local',
					status: 'queued',
					gcode: printjob.gcode,
					PrintjobId: printjob.id
				})
				.success(function(queueitem)
				{
					res.send('OK');
				});
			});
		}
	});

	routes.delete('/queue/:id', function( req, res )
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
					res.send('OK');
				});
			}
		});
	});
};