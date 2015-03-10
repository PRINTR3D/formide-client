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

module.exports =
{
	uploadModelfile: function( file, callback )
	{
		fs.readFile(file.path, function( err, data )
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = FormideOS.config.get('paths.modelfile') + '/' + hash;

			fs.writeFile(newPath, data, function( err )
			{
				if(err)
				{
					FormideOS.manager('debug').log( err );
					return callback({
						status: 404,
						message: 'could not upload file'
					});
				}
				else
				{
					FormideOS.manager('db').db.Modelfile.create({
						filename: file.name,
						filesize: file.size,
						hash: hash
					});

					return callback({
						status: 200,
						message: 'OK'
					});
				}
			});
		});
	},

	uploadGcode: function( file, callback )
	{
		fs.readFile(file.path, function( err, data )
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = FormideOS.config.get('paths.gcode') + '/' + hash;

			fs.writeFile(newPath, data, function( err )
			{
				if(err)
				{
					FormideOS.manager('debug').log( err );
					return callback({
						status: 404,
						message: 'could not upload file'
					});
				}
				else
				{
					FormideOS.manager('db').db.Modelfile.create({
						filename: file.name,
						filesize: file.size,
						hash: hash
					});

					return callback({
						status: 200,
						message: 'OK'
					});
				}
			});
		});
	},

	downloadModelfile: function( hash, encoding, callback )
	{
		var filename = FormideOS.config.get('paths.modelfile') + '/' + hash;

		fs.exists(filename, function( exists )
		{
			if(exists)
			{
				fs.readFile(filename, function(err, data)
				{
					if(err)
					{
						FormideOS.manager('debug').log(err, true);
					}
					else
					{
						if(encoding == 'base64')
						{
							var base64File = new Buffer(data, 'binary').toString('base64');
							return callback( base64File );
						}
						else
						{
							return callback( data );
						}
					}
				});
			}
			else
			{
				return callback({
					status: 404,
					message: 'file not found'
				});
			}
		});
	},

	downloadGcode: function( filename, callback )
	{

	}
}