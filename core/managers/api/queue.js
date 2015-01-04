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

module.exports = function(app)
{
	app.post('/slicing', function(req, res)
	{
		if(req.body.sliceparams && req.body.modelfile && req.body.sliceprofile && req.body.materials && req.body.printer && req.body.slicemethod)
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');

			var json = {
				"type": "slice",
				"data": req.body.sliceparams
			};

			var model = {
				"hash": json.data.model,
				"bucketIn": Printspot.config.get('paths.modelfile'),
				"x": 10000,
				"y": 10000,
				"z": 0
			};

			json.data.model = [model];
			json.data.bucketOut = Printspot.config.get('paths.gcode');
			json.data.responseID = hash;

			if(req.body.slicemethod == 'local')
			{
				// create printjob in DB
				Printspot.manager('database').db.Printjob
				.create(
				{
					ModelfileId: req.body.modelfile.id,
					printerID: req.body.printer.id,
					sliceprofileID: req.body.sliceprofile.id,
					materials: JSON.stringify(req.body.materials),
					sliceResponse: hash,
					sliceParams: JSON.stringify(req.body.sliceparams),
					sliceMethod: 'local'
				})
				.success(function(printjob)
				{
					// send slice request to local slicer
					Printspot.events.emit('slice', json);
					return res.json('OK');
				});
			}
		}
	});

	app.post('/addtoqueue', function(req, res)
	{
		if(req.body.printjobID)
		{
			Printspot.manager('database').db.Printjob.find({where: {id: req.body.printjobID}})
			.success(function(printjob)
			{
				Printspot.manager('database').db.Queueitem
				.create({
					origin: 'local',
					status: 'queued',
					gcode: printjob.gcode,
					PrintjobId: printjob.id
				})
				.success(function(queueitem)
				{
					return res.json('OK');
				});
			});
		}
	});

	app.get('/getqueue', function(req, res)
	{
		Printspot.manager('database').db.Queueitem
		.findAll({where: {status: 'queued'}, include: [{model: Printspot.manager('database').db.Printjob, include: [{model: Printspot.manager('database').db.Modelfile}]}]})
		.success(function(queue)
		{
			return res.json(queue);
		});
	});
};