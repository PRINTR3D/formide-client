/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var util = require('util');

module.exports = function(routes, module)
{	
	/*
	 *	Start a new slice request and creates a new printjob in the database. Uses modelfiles, sliprofile, materials, printer and optional settings as input.
	 */
	routes.post('/slice', function(req, res) {
		module.slice(req.body.modelfiles, req.body.sliceprofile, req.body.materials, req.body.printer, req.body.settings, function(err, printjob) {
			if (err) return res.send({ success: false, eror: err });
			return res.send({
				success: true,
				printjob: printjob
			});
		});
	});
	
	/*
	 * Get the generated slicerequest for an existing printjob.
	 */
	routes.get('/generaterequest/:printjobID', function(req, res) {
		module.createSliceRequest(req.params.printjobID, function(err, slicerequest) {
			if (err) return res.send(err);
			return res.send(slicerequest);
		});
	});
};