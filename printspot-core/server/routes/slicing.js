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

module.exports = exports = function(app)
{
	app.post('/slicing', function(req, res)
	{
		if(req.body.sliceparams && req.body.modelfile && req.body.sliceprofile && req.body.materials && req.body.printer && req.body.slicemethod) {

			var json = {
				"type": "slice",
				"data": req.body.sliceparams
			};

			json.data.model = "uploads/modelfiles/" + json.data.model;

			if(req.body.slicemethod == 'local')
			{
				global.comm.slicer.write(JSON.stringify(json));
			}
			else if(req.body.slicemethod == 'cloud')
			{
				// call online katana via websockets
			}

			global.db.Printjob.create({
				modelfileID: req.body.modelfile.id,
				printerID: req.body.printer.id,
				sliceprofileID: req.body.sliceprofile.id,
				materials: JSON.stringify(req.body.materials),
				sliceParams: JSON.stringify(req.body.sliceparams),
				sliceMethod: 'local'
			}).success(function(printjob) {
				return res.json('OK');
			});
		}
	});

	app.post('/addtoqueue', function(req, res)
	{
		if(req.body.printjobID)
		{
			global.db.Printjob.find({where: {id: data.data.responseID}}).success(function(printjob)
			{
				global.db.Queueitem.create({
					origin: 'local',
					printjobID: printjob.id,
					status: 'queued',
					gcode: printjob.gcode
				});
				return res.json('OK');
			});
		}
	});

	global.log('info', 'Module loaded: routes/slicing.js', {});
};