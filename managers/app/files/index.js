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

var fs 		= require('fs');

module.exports =
{
	init: function()
	{

	},

	uploadModelfile: function()
	{

	},

	uploadGcode: function()
	{

	},

	downloadModelfile: function( filename, callback )
	{
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
						if(req.query.encoding == 'base64')
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