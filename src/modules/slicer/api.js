/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var util = require('util');

module.exports = function(routes, module)
{
	/*
	 *	Start a new slice request and creates a new printjob in the database. Uses modelfiles, sliprofile, materials, printer and optional settings as input.
	 */
	routes.post('/slice', function(req, res) {
		module.slice(req.user.id, req.body.name, req.body.files, req.body.sliceProfile, req.body.materials, req.body.printer, req.body.settings, function(err, printJob) {
			if (err) return res.serverError(err);
			return res.ok({ printJob: printJob });
		});
	});

	/*
	 * Get the generated slicerequest for an existing printjob.
	 */
	routes.get('/generaterequest/:printJobId', function(req, res) {
		module.createSliceRequest(req.params.printJobId, function(err, sliceRequest) {
			if (err) return res.serverError(err);
			return res.json(sliceRequest);
		});
	});

	/*
	 * Get the reference so the interface can build forms
	 */
	routes.get('/reference', function(req, res) {
		module.getReferenceFile(function(err, reference) {
			if (err) return res.serverError(err);
			return res.json(reference);
		});
	});
};
