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
	 */
	routes.get('/gcodefiles', function(req, res) {
/*
		db.Gcodefile.find().exec(function(err, gcodefiles) {
			if (err) return res.send(err);
			return res.send(gcodefiles);
		});
*/
		return res.send([]);
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
	 * Edit the prettyname of a gcodefile (name that appears in the file list)
	 */
	routes.post('/modelfiles/:id', function(req, res) {
		db.Gcodefile.update({ _id: req.params.id }, { prettyname: req.body.prettyname },function(err) {
			if (err) return res.send(err);
			return res.send({
				success: true
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