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

var util = require('util');

module.exports = function(routes, module)
{
	/**
	 * Slice!
	 */
	routes.post('/slice', FormideOS.manager('core.http').server.permissions.check('slicer'), function( req, res )
	{
		req.checkBody('sliceparams', 'sliceparams invalid').notEmpty();
		req.checkBody('modelfile', 'modelfile invalid').notEmpty().isInt();
		req.checkBody('sliceprofile', 'sliceprofile invalid').notEmpty().isInt();
		req.checkBody('materials', 'materials invalid').notEmpty();
		req.checkBody('printer', 'printer invalid').notEmpty().isInt();
		req.checkBody('slicemethod', 'slicemethod invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		var _sliceparams = req.body.sliceparams;
		var _modelfile = req.body.modelfile;
		var _sliceprofile = req.body.sliceprofile;
		var _materials = req.body.materials;
		var _printer = req.body.printer;
		var _slicemethod = req.body.slicemethod;
		var _hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');

		FormideOS.manager('app.log').log( 'debug', _sliceparams );

		var json = {
			"type": "slice",
			"data": _sliceparams
		};

		// TODO: still hardcoded to 10 by 10 cm and with extruder 1
		var model = {
			"hash": json.data.model,
			"bucketIn": FormideOS.appRoot + FormideOS.config.get('paths.modelfile'),
			"x": 100000,
			"y": 100000,
			"z": 0,
			"extruder": "extruder1",
			"settings": "1"
		};

		json.data.model = [model];
		json.data.bucketOut = FormideOS.appRoot + FormideOS.config.get('paths.gcode');
		json.data.responseID = _hash;

		if( _slicemethod == 'local' )
		{
			// create printjob in DB
			FormideOS.manager('core.db').db.Printjob
			.create(
			{
				ModelfileId: 	_modelfile,
				printerID: 		_printer,
				sliceprofileID: _sliceprofile,
				materials: 		JSON.stringify( _materials ),
				sliceResponse: 	"{" + _hash + "}",
				sliceParams: 	JSON.stringify( _sliceparams ),
				sliceMethod: 	'local'
			})
			.success(function(printjob)
			{
				// send slice request to local slicer
				FormideOS.manager('core.events').emit('slicer.slice', json);
				return res.send({
					status: 200,
					message: 'slicing started'
				});
			});
		}
		else
		{
			return res.send({
				status: 404,
				message: "only local slicing available"
			});
		}
	});
};