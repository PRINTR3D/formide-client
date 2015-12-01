/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	/*
	 * Returns a json list of all uploaded userfiles (their properties, not the actual file contents)
	 */
	routes.get('/files', function(req, res) {
		db.UserFile
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
/*
		.skip(req.query.offset || 0)
		.limit(req.query.limit || 25)
*/
		.populate('printJobs')
		.populate('createdBy')
		.exec(function (err, userFiles) {
			if (err) return res.serverError(err);
			return res.ok(userFiles);
		});
	});

	/*
	 * Returns a json object with info about a single userfile including printjobs
	 */
	routes.get('/files/:id', function(req, res) {
		db.UserFile
		.findOne({ createdBy: req.user.id, id: req.params.id })
		.populate('createdBy')
		.exec(function( err, userFile) {
			if (err) return res.serverError(err);
			if (!userFile) return res.notFound("File not found");
			db.PrintJob
			.find({ files: userFile.id })
			.populate('materials')
			.populate('printer')
			.populate('sliceProfile')
			.populate('files')
			.exec(function (err, printjobs) {
				if (err) return res.serverError(err);
				userFile = userFile.toObject();
				userFile.printjobs = printjobs;
				return res.ok(userFile);
			});
		});
	});

	/*
	 * Edit the prettyname of a userfile (name that appears in the file list)
	 */
	routes.post('/files/:id', function(req, res) {
		db.UserFile.update({ id: req.params.id, createdBy: req.user.id }, {
			prettyname: req.body.prettyname,
			createdBy: req.user.id
		}, function (err, updated) {
			if (err) return res.serverError(err);
			return res.send({
				message: "Userfile updated",
				file: updated[0]
			});
		});
	});

	/*
	 * Delete a userfile entry by ID.
	 */
	routes.delete('/files/:id', function(req, res) {
		db.UserFile.destroy({ id: req.params.id, createdBy: req.user.id }, function (err) {
			if (err) return res.serverError(err);
			return res.send({
				message: "Userfile deleted"
			});
		});
	});
};
