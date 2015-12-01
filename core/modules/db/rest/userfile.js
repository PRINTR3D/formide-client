/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, db) => {

	/**
	 * List all userFiles
	 */
	routes.get('/files', (req, res) => {
		db.UserFile
		.find({ createdBy: req.user.id }, { select: ((req.query.fields) ? req.query.fields.split(',') : "") })
		.populate('createdBy')
		.then(res.ok)
		.error(res.serverError);
	});

	/**
	 * Get a single userFile with all it's sliced versions (printJobs)
	 */
	routes.get('/files/:id', (req, res) => {
		db.UserFile
		.findOne({ createdBy: req.user.id, id: req.params.id })
		.populate('createdBy')
		.then((userFile) => {
			db.PrintJob
			.find({ files: userFile.id })
			.populate('materials')
			.populate('printer')
			.populate('sliceProfile')
			.populate('files')
			.then((printJobs) => {
				userFile = userFile.toObject();
				userFile.printJobs = printJobs;
				return res.ok(userFile);
			})
			.error(res.serverError);
		})
		.error(res.serverError);
	});

	/**
	 * Update a userFile
	 */
	routes.post('/files/:id', function(req, res) {
		db.UserFile
		.update({ id: req.params.id, createdBy: req.user.id }, {
			prettyname:	req.body.prettyname
		})
		.then((updated) => {
			return res.ok({ message: "File updated", file: updated[0] })
		})
		.error(res.serverError);
	});

	/**
	 * Delete a userFile
	 */
	routes.delete('/files/:id', function(req, res) {
		db.UserFile
		.destroy({ id: req.params.id, createdBy: req.user.id })
		.then(() => {
			return res.ok({ message: "File deleted" });
		})
		.error(res.serverError);
	});
};
