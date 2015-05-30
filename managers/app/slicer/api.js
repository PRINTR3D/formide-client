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
	routes.get('/slice', function(req, res) {
		var docs = {
			endpoint: "/api/slice",
			method: "POST",
			parameters: [
				{
					name: "printerId",
					type: "integer",
					description: "An ID of one of your printers"
				},
				{
					name: "sliceprofileId",
					type: "integer",
					description: "An ID of one of your sliceprofiles"
				},
				{
					name: "sliceMethod",
					type: "string",
					description: "The method of slicing you want to do",
					values: ["local", "cloud"]
				},
				{
					name: "models",
					type: "array",
					description: "The models you want to slice",
					item: [
						{
							name: "hash",
							type: "string",
							description: "The hash of a file",
						},
						{
							name: "x",
							type: "integer",
							description: "The x position on the bed in microns"	
						},
						{
							name: "y",
							type: "integer",
							description: "The y position on the bed in microns"
						},
						{
							name: "z",
							type: "integer",
							description: "The z position on the bed in microns"
						},
						{
							name: "extnr",
							type: "integer",
							description: "The number of the extruder that should print this model"
						},
						{
							name: "settings",
							type: "integer",
							description: "The ID of one of the region settings provided in the region settings parameter"
						}
					]
				},
				{
					name: "settings",
					type: "object",
					description: "Additional settings for this slice request",
					items: [
						{
							name: "bed",
							type: "object",
							description: "heated bed settings",
							items: [
								{
									name: "temp",
									type: "integer",
									description: "the temperature of the bed"
								},
								{
									name: "firstLayerTemp",
									type: "integer",
									description: "the temperature of the bed during the first layers"
								}
							]
						},
						{
							name: "materials",
							type: "array",
							description: "material settings",
							item: [
								{
									name: "materialId",
									type: "integer",
									description: "An ID of one of your materials"
								},
								{
									name: "extnr",
									type: "integer",
									description: "Which extruder should use this material's settings"
								}
							]
						},
						{
							name: "raft",
							type: "object",
							description: "raft settings",
							items: [
								{
									name: "use",
									type: "boolean",
									description: "use a raft or not"
								},
								{
									name: "extnr",
									type: "integer",
									description: "which extruder should print the raft"
								}
							]
						},
						{
							name: "brim",
							type: "object",
							description: "brim settings",
							items: [
								{
									name: "use",
									type: "boolean",
									description: "use a brim or not"
								},
								{
									name: "extnr",
									type: "integer",
									description: "which extruder should print the brim"
								}
							]
						},
						{
							name: "skirt",
							type: "object",
							description: "skirt settings",
							items: [
								{
									name: "use",
									type: "boolean",
									description: "use a skirt or not"
								},
								{
									name: "extnr",
									type: "integer",
									description: "which extruder should print the skirt"
								}
							]
						},
						{
							name: "support",
							type: "object",
							description: "support settings",
							items: [
								{
									name: "type",
									type: "string",
									description: "Which support type to use",
									values: ["none", "buildplate", "both"]
								},
								{
									name: "extnr",
									type: "integer",
									description: "which extruder should print the support"
								}
							]
						},
						{
							name: "fan",
							type: "object",
							description: "fan settings",
							items: [
								{
									name: "use",
									type: "boolean",
									description: "use the fan or not"
								}
							]
						}
					]
				},
				{
					name: "regionsettings",
					type: "array",
					description: "settings for custom regions",
					item: [
						{
							name: "regio",
							type: "integer",
							description: "the absolute percentage from which this region should start"
						},
						{
							name: "outerwallspeed",
							type: "integer",
							description: "printspeed of the outer wall of a model",
							optional: true
						},
						{
							name: "innerwallspeed",
							type: "integer",
							description: "printspeed of the inner wall of a model",
							optional: true
						},
						{
							name: "printspeed",
							type: "integer",
							description: "printspeed of a model",
							optional: true
						},
						{
							name: "infillspeed",
							type: "integer",
							description: "the printspeed of the infill of a model",
							optional: true
						},
						{
							name: "infillamount",
							type: "integer",
							description: "the percentage of infill of a model",
							optional: true
						},
						{
							name: "layerheight",
							type: "integer",
							description: "the layerheight of a model",
							optional: true
						}
					]
				}
			]
		};
		
		res.json(docs);
	});
	
	
	/**
	 * 	/api/slice
	 *	POST
	 *	
	 */
	routes.post('/slice', FormideOS.manager('core.http').server.permissions.check('slicer'), function( req, res )
	{
		// Check post parameters
/*
		req.checkBody('models', 'models invalid, is madatory and must be an array').notEmpty().isArray();
		req.checkBody('printerId', 'printerId invalid, is madatory').notEmpty();
		req.checkBody('sliceprofileId', 'sliceprofileId invalid, is madatory').notEmpty();
		req.checkBody('settings', 'settings invalid, is madatory and must be an array').notEmpty().isArray();
		req.checkBody('regionsettings', 'regionsettings invalid, must be an array').isArray();
		req.checkBody('sliceMethod', 'sliceMethod is invalid, is mandatory and must be a string').notEmpty();
*/
		

		
/*
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
*/
		console.log(req);
		var parsedBody = req.body; //JSON.parse(req.body);

		var _sliceparams = parsedBody.sliceparams;
		var _modelfile = parsedBody.modelfile;
		var _sliceprofile = parsedBody.sliceprofile;
		var _materials = parsedBody.materials;
		var _printer = parsedBody.printer;
		var _slicemethod = parsedBody.slicemethod;

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