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

module.exports = function(routes, db)
{
	/*
	 * Returns a json list of all uploaded modelfiles (their properties, not the actual files)
	 * We use the reversePopulate plugin to also attach a list of printjobs where each modelfile is referenced
	 */
	routes.get('/modelfiles', FormideOS.manager('core.http').server.permissions.check('rest:modelfile'), function(req, res) {
		db.Modelfile.find().lean().exec(function(err, modelfiles) {
			if (err) return res.send(err);
			reversePopulate(modelfiles, "printjobs", true, db.Printjob, "modelfiles", function(err, popModelfiles) {
				if (err) return res.send(err);
				return res.send(popModelfiles);
    		});
		});
	});

	/*
	 * Returns a json object with info about a single modelfile
	 * We use the reversePopulate plugin to also attach a list of printjobs where the modelfile is referenced
	 */
	routes.get('/modelfiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:modelfile'), function(req, res) {
		db.Modelfile.find({ _id: req.params.id }).lean().exec(function(err, modelfile) {
			if (err) return res.send(err);
			reversePopulate(modelfile, "printjobs", true, db.Printjob, "modelfiles", function(err, popModelfile) {
				if (err) return res.send(err);
				return res.send(popModelfile[0]);
    		});
		});
	});

	/*
	 * Delete a modelfile entry by ID.
	 */
	routes.delete('/modelfiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:modelfile'), function(req, res) {
		// TODO: remove actual modelfile from disk
		db.Modelfile.remove({ _id: req.params.id }, function(err, modelfile) {
			if (err) return res.status(400).send(err);
			if (modelfile) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});
};