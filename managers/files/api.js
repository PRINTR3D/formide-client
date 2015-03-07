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

var fs = require('fs');

module.exports = function(routes, module)
{
	routes.get('/download', function( req, res )
	{
		// TODO: check if file exists
/*
		fs.readFile(FormideOS.config.get('paths.modelfile') + '/' + req.query.hash, function(err, data)
		{
			if(err)
			{
				FormideOS.debug(err, true);
			}
			else
			{
				if(req.query.encoding == 'base64')
				{
					var base64File = new Buffer(data, 'binary').toString('base64');
					res(base64File);
				}
				else
				{
					res(data);
				}
			}
		});
*/
	});

	routes.post('/upload', function( req, res )
	{
		// TODO: check if valid 3D file
/*
		var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
		var newPath = FormideOS.config.get('paths.modelfile') + '/' + hash;

		req.payload['file'].pipe(fs.createWriteStream(newPath));

		FormideOS.db.Modelfile.create(
		{
			filename: req.payload.file.hapi.filename,
			filesize: parseInt(req.headers['content-length']),
			hash: hash
		});

		res('OK');
*/
	});

	routes.post('/uploadgcode', function( req, res )
	{
		// TODO: check if valid gcode file
		// TODO: add gcode filesize to printjobs table
/*
		var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
		var newPath = FormideOS.config.get('paths.gcode') + '/' + hash;

		req.payload['file'].pipe(fs.createWriteStream(newPath));

		FormideOS.db.Printjob.create(
		{
			gcode: hash,
			sliceMethod: 'custom'
		});

		res('OK');
*/
	});
};