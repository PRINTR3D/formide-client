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
	/*
	 *	Start a new slice request and creates a new printjob in the database. Uses modelfiles, sliprofile, materials, printer and optional settings as input.
	 */
	routes.post('/slice', FormideOS.manager('core.http').server.permissions.check('slicer'), function(req, res) {
		module.slice(req.body.modelfiles, req.body.sliceprofile, req.body.materials, req.body.printer, req.body.settings, function(err, printjob) {
			if (err) return res.send(err);
			return res.send({
				success: true,
				printjob: printjob
			});
		});
	});
	
	/*
	 * Get the generated slicerequest for an existing printjob.
	 */
	routes.get('/generaterequest/:printjobID', FormideOS.manager('core.http').server.permissions.check('slicer'), function(req, res) {
		module.createSliceRequest(req.params.printjobID, function(err, slicerequest) {
			if (err) return res.send(err);
			return res.send(slicerequest);
		});
	});
};