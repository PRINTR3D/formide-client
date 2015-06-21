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
 
var reversePopulate = require('mongoose-reverse-populate');
var fs				= require('fs');

module.exports = function(routes, db)
{
	/*
	 * Returns a json list of all uploaded modelfiles (their properties, not the actual files)
	 * We use the reversePopulate plugin to also attach a list of printjobs where each modelfile is referenced
	 */
	routes.get('/modelfiles', function(req, res) {
		db.Modelfile.find().exec(function(err, modelfiles) {
			if (err) return res.send(err);
			return res.send(modelfiles);
		});
	});

	/*
	 * Returns a json object with info about a single modelfile
	 * We use the reversePopulate plugin to also attach a list of printjobs where the modelfile is referenced
	 */
	routes.get('/modelfiles/:id', function(req, res) {
		db.Modelfile.findOne({ _id: req.params.id }).lean().exec(function(err, modelfile) {
			if (err) return res.send(err);
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
	routes.delete('/modelfiles/:id', function(req, res) {
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