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

var fs 					= require('fs');
var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app)
{
	/**
	 * Download a modelfile
	 */
	app.get('/download', function(req, res)
	{
		// TODO: check if file exists

		fs.readFile(Printspot.config.get('paths.modelfile') + '/' + req.query.hash, function(err, data)
		{
			if(err)
			{
				Printspot.debug(err, true);
			}
			else
			{
				if(req.query.encoding == 'false')
				{
					return res.send(data);
				}
				else
				{
					var base64File = new Buffer(data, 'binary').toString('base64');
					return res.send(base64File);
				}
			}
		});
	});

	/**
	 * Upload a modelfile
	 */
	app.post('/upload', multipartMiddleware, function(req, res)
	{
		// TODO: check if valid 3D file

		fs.readFile(req.files.file.path, function(err, data)
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = Printspot.config.get('paths.modelfile') + '/' + hash;

			fs.writeFile(newPath, data, function(err)
			{
				if(err)
				{
					Printspot.debug(err);
				}
				else
				{
					Printspot.manager('database').db.Modelfile.create(
					{
						filename: req.files.file.name,
						filesize: req.files.file.size,
						hash: hash
					});

					res.json('OK');
				}
			});
		});
	});

	/**
	 * Upload a gcode file (add to queue as 'custom')
	 */
	app.post('/uploadgcode', multipartMiddleware, function(req, res)
	{
		// TODO: check if valid gcode file

		fs.readFile(req.files.file.path, function(err, data)
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = Printspot.config.get('paths.gcode') + '/' + hash;

			fs.writeFile(newPath, data, function(err)
			{
				if(err)
				{
					Printspot.debug(err);
				}
				else
				{
					Printspot.manager('database').db.Printjob.create(
					{
						gcode: hash,
						sliceMethod: 'custom'
					});

					res.json('OK');
				}
			});
		});
	});
}