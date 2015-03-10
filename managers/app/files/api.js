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
	routes.get('/download', function( req, res )
	{
		module.downloadModelfile(req.query.hash, req.query.encoding, function( response )
		{
			res.send( response );
		});
	});

	routes.post('/upload', multipartMiddleware, function( req, res )
	{
		module.uploadModelfile(req.files.file, function( response )
		{
			res.send( response );
		});
	});

	routes.post('/uploadgcode', function( req, res )
	{
		module.uploadGcode(req.files.file, function( response )
		{
			res.send( response );
		});
	});
};