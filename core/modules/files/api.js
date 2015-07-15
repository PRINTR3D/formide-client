/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(routes, module)
{	
	routes.get('/modelfiles/download', FormideOS.http.permissions.check('files:download'), function(req, res) {
		req.checkQuery('hash', 'hash invalid').notEmpty();
		req.checkQuery('encoding', 'encoding invalid').notEmpty();

		if (req.validationErrors()) {
			return res.status(400).json({
				status: 400,
				errors: req.validationErrors()
			});
		}

		module.downloadModelfile(req.query.hash, req.query.encoding, function(err, filecontents) {
			if(err) return res.send(err);
			return res.send(filecontents);
		});
	});

	routes.get('/gcode/download', FormideOS.http.permissions.check('files:download'), function(req, res) {
		req.checkQuery('hash', 'hash invalid').notEmpty();
		req.checkQuery('encoding', 'encoding invalid').notEmpty();

		if (req.validationErrors()) {
			return res.status(400).json({
				status: 400,
				errors: req.validationErrors()
			});
		}

		module.downloadGcode(req.query.hash, req.query.encoding, function(err, response) {
			if(err) return res.send(err);
			return res.send(filecontents);
		});
	});

	routes.post('/upload', FormideOS.http.permissions.check('files:upload'), multipartMiddleware, function(req, res) {
		if (!req.files) {
			return res.status(400).json({
				success: false,
				message: "No files posted"
			});
		}
		
		var ext = req.files.file.originalFilename.split('.')[1];
		
		if (ext === 'stl' || ext === 'STL') {
			module.uploadModelfile(req.files.file, function(err, modelfile) {
				if (err) return res.send(err);
				return res.send({
					success: true,
					modelfile: modelfile
				});
			});
		}
		else if (ext === 'gcode' || ext === 'GCODE') {
			module.uploadGcode(req.files.file, function(err, gcodefile) {
				if (err) return res.send(err);
				return res.send({
					success: true,
					gcodefile: gcodefile
				});
			});
		}
	});
};