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

var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(routes, module)
{
	routes.get('/modelfiles/download', FormideOS.manager('http').server.permissions.check('files'), function(req, res) {
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

	routes.get('/gcode/download', FormideOS.manager('http').server.permissions.check('files'), function(req, res) {
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

	routes.post('/modelfiles/upload', FormideOS.manager('http').server.permissions.check('files'), multipartMiddleware, function(req, res) {
		if (!req.files) {
			return res.status(400).json({
				success: false,
				message: "No files posted"
			});
		}

		module.uploadModelfile(req.files.file, function(err) {
			if (err) return res.send(err);
			return res.send({
				success: true
			});
		});
	});

	routes.post('/gcode/upload', FormideOS.manager('http').server.permissions.check('files'), multipartMiddleware, function(req, res) {
		if( !req.files ) {
			return res.status(400).json({
				status: 400,
				errors: "No files posted"
			});
		}

		module.uploadGcode(req.files.file, function(err) {
			if (err) return res.send(err);
			return res.send({
				success: true
			});
		});
	});
};