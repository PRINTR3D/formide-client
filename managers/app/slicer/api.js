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

module.exports = function(routes, module)
{
	/**
	 * Slice!
	 */
	routes.all('/slice', function( req, res )
	{
		if(req.query.sliceparams && req.query.modelfile && req.query.sliceprofile && req.query.materials && req.query.printer && req.query.slicemethod)
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');

			var json = {
				"type": "slice",
				"data": req.payload.sliceparams
			};

			var model = {
				"hash": json.data.model,
				"bucketIn": FormideOS.appRoot + FormideOS.config.get('paths.modelfile'),
				"x": 100000,
				"y": 100000,
				"z": 0,
				"extruder": "extruder1"
			};

			// TODO: still hardcoded to 10 by 10 cm and with extruder 1

			json.data.model = [model];
			json.data.bucketOut = FormideOS.appRoot + FormideOS.config.get('paths.gcode');
			json.data.responseID = hash;

			if(req.payload.slicemethod == 'local')
			{
				// create printjob in DB
				FormideOS.manager('core.db').db.Printjob
				.create(
				{
					ModelfileId: req.payload.modelfile.id,
					printerID: req.payload.printer.id,
					sliceprofileID: req.payload.sliceprofile.id,
					materials: JSON.stringify(req.payload.materials),
					sliceResponse: "{" + hash + "}",
					sliceParams: JSON.stringify(req.payload.sliceparams),
					sliceMethod: 'local'
				})
				.success(function(printjob)
				{
					// send slice request to local slicer
					FormideOS.manager('core.events').emit('slicer.slice', json);
					res.send('OK');
				});
			}
		}
		else
		{
			FormideOS.manager('debug').log('Cannot slice with incomplete parameters', true);
		}
	});
};