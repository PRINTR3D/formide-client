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

module.exports =
{
	initialize: function()
	{
		var self = this;

		console.log( 'permissions check' );

		return function( req, res, next )
		{
			next();
		}
	},

	check: function( permission )
	{
		var self = this;
		var permissions = ['slicer'];

		return function( req, res, next )
		{
			// check if permission is in user's permissions
			if( permissions.indexOf( permission ) > -1 )
			{
				return next();
			}

			return res.status(401).send({
				status: 401,
				errors: 'No permission'
			});
		}
	}
}