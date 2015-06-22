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
	 */
	routes.get('/gcodefiles', function(req, res) {
		db.Gcodefile.find().exec(function(err, gcodefiles) {
			if (err) return res.send(err);
			return res.send(gcodefiles);
		});
	});

	/*
	 * Returns a json object with info about a single modelfile
	 */
	routes.get('/gcodefiles/:id', function(req, res) {
		db.Gcodefile.findOne({ _id: req.params.id }).lean().exec(function(err, gcodefile) {
			if (err) return res.send(err);
			if (!gcodefile) return res.json('no modelfile found with that id');
			db.Printjob.find({ gcodefile: gcodefile._id }).populate('materials printer sliceprofile gcodefile').exec(function(err, printjobs) {
				if (err) return res.send(err);
				gcodefile.printjobs = printjobs;
				return res.send(gcodefile);
			});
		});
	});

	/*
	 * Delete a modelfile entry by ID.
	 */
	routes.delete('/gcodefiles/:id', function(req, res) {
		db.Gcodefile.remove({ _id: req.params.id }, function(err, gcodefile) {
			if (err) return res.status(400).send(err);
			var filePath = FormideOS.config.get('paths.gcode') + '/' + gcodefile.hash;
			fs.unlink(filePath, function() {
				return res.send({
					success: true
				});
			});
		});
	});
};