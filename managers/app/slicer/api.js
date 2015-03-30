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

		if( _slicemethod == 'local' )
		{
			module.slice(_sliceparams, _modelfile, _sliceprofile, _materials, _printer, function(success) {
				if (success) {
					return res.send({
						status: 200,
						message: 'slicing started'
					});
				}
				else {
					return res.send({
						status: 402,
						message: "slicing failed"
					});
				}
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