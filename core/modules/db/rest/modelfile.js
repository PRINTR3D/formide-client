/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
var reversePopulate = require('mongoose-reverse-populate');
var fs				= require('fs');

module.exports = function(routes, db)
{
	/*
	 * Returns a json list of all uploaded modelfiles (their properties, not the actual files)
	 * We use the reversePopulate plugin to also attach a list of printjobs where each modelfile is referenced
	 */
	routes.get('/modelfiles', FormideOS.http.permissions.check('db:modelfile:read'), function(req, res) {
		db.Modelfile.find().exec(function(err, modelfiles) {
			if (err) return res.send(err);
			return res.send(modelfiles);
		});
	});

	/*
	 * Returns a json object with info about a single modelfile
	 * We use the reversePopulate plugin to also attach a list of printjobs where the modelfile is referenced
	 */
	routes.get('/modelfiles/:id', FormideOS.http.permissions.check('db:modelfile:read'), function(req, res) {
		db.Modelfile.findOne({ _id: req.params.id }).lean().exec(function(err, modelfile) {
			if (err) return res.send(err);
			if (!modelfile) return res.json('no modelfile found with that id');
			db.Printjob.find({ modelfiles: modelfile._id }).populate('materials printer sliceprofile modelfiles').exec(function(err, printjobs) {
				if (err) return res.send(err);
				modelfile.printjobs = printjobs;
				return res.send(modelfile);
			});
		});
	});

	/*
	 * Delete a modelfile entry by ID.
	 */
	routes.delete('/modelfiles/:id', FormideOS.http.permissions.check('db:modelfile:write'), function(req, res) {
		db.Modelfile.remove({ _id: req.params.id }, function(err, modelfile) {
			if (err) return res.status(400).send(err);
			var filePath = FormideOS.config.get('paths.modelfile') + '/' + modelfile.hash;
			fs.unlink(filePath, function() {
				return res.send({
					success: true
				});
			});
		});
	});
};