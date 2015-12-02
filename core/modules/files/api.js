/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();
var path                = require('path');

module.exports = function(routes, module) {

	/*
	 * Download a modelfile by hash in url query
	 */
	routes.get('/download', function(req, res) {
		module.downloadFile(req.query.hash, req.query.encoding, req.user.id, function(err, filecontents) {
			if(err) return res.serverError(err);
			if (!filecontents) return res.notFound();
			return res.send(filecontents); // don't use res.ok here!
		});
	});

	/*
	 * Upload a file, can be stl or gcode for now
	 */
	routes.post('/upload', multipartMiddleware, function(req, res) {
		if (!req.files.file) {
			return res.badRequest("No file found in request");
		}

		var ext = path.extname(req.files.file.originalFilename).toLowerCase();
		if (ext === '.stl' || ext === '.gcode') {
			module.uploadFile(req.files.file, "text/" + ext.replace('.', ''), req.user.id, function(err, uploadedFile) {
				if(err) return res.serverError(err);
				return res.ok({
					message: "Uploaded file",
					file: uploadedFile
				});
			});
		}
        else {
	        return res.badRequest("Invalid filetype. Should be STL or Gcode")
		}
	});

	/*
	 * Upload a file by remote url. Needs url, filename and filetype as body params
	 */
	// routes.post('/upload/url', function(req, res) {
	// 	// TODO: fix hardcoded text/stl filetype
	// 	module.uploadFromUrl(req.body.url, req.body.filename, "text/stl", req.user.id, function(err, userFile) {
	// 		if(err) return res.serverError(err);
	// 		return res.ok({
	// 			message: "File uploaded from remote url",
	// 			file: userFile
	// 		});
	// 	});
	// });
};
