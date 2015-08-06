/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();
var path                = require('path');

module.exports = function(routes, module)
{	
	/*
	 * Download a modelfile by hash in url query
	 */
	routes.get('/modelfiles/download', function(req, res) {
		module.downloadModelfile(req.query.hash, req.query.encoding, function(err, filecontents) {
			if(err) return res.send(err);
			return res.send(filecontents);
		});
	});

	/*
	 * Download a gcodefile by hash in url query
	 */
	routes.get('/gcodefiles/download', function(req, res) {
		module.downloadGcode(req.query.hash, req.query.encoding, function(err, response) {
			if(err) return res.send(err);
			return res.send(filecontents);
		});
	});

	/*
	 * Upload a file, can be stl or gcode for now
	 */
	routes.post('/upload', multipartMiddleware, function(req, res) {
		if (!req.files.file) {
			return res.status(400).json({
				success: false,
				message: "No files posted"
			});
		}
		
		var ext = path.extname(req.files.file.originalFilename).toLowerCase();

		if (ext === '.stl') {
			module.uploadModelfile(req.files.file, function(err, modelfile) {
				if (err) return res.send(err);
				return res.send({
					success: true,
					modelfile: modelfile
				});
			});
		}
		else if (ext === '.gcode') {
			module.uploadGcode(req.files.file, function(err, gcodefile) {
				if (err) return res.send(err);
				return res.send({
					success: true,
					gcodefile: gcodefile
				});
			});
		}
        else {
			return res.status(400).json({
				success: false,
				message: "Wrong file format"
			});
		}
	});
	
	/*
	 * Upload a file by remote url. Needs url, filename and filetype as body params
	 */
	routes.post('/upload/url', function(req, res) {
		module.uploadFromUrl(req.body.url, req.body.filename, req.body.filetype, function(err, modelfile) {
			return res.send({
				success: true,
				modelfile: modelfile
			});
		});
	});
};