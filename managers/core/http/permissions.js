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
		var permissions = ['log', 'slicer'];

		return function( req, res, next )
		{
			req._permissions = {};
			req._permissions.instance = self;

			if(req.user && req.session['permissions'])
			{
				FormideOS.manager('debug').log( 'Session set and permissions found' );
				req._permissions.session = true;
				req._permissions.permissions = req.session['permissions'];
			}
			else if(req.user)
			{
				FormideOS.manager('debug').log( 'Session set and permissions fetched from DB' );
				var permissions = req.user.permissions.split(",");
				req._permissions.session = true;
				req.session['permissions'] = permissions;
				req._permissions.permissions = req.session['permissions'];
			}
			else
			{
				FormideOS.manager('debug').log( 'Session not set' );
				req._permissions.session = false;
			}

			next();
		}
	},

	check: function( permission )
	{
		return function( req, res, next )
		{
			return next();

			if(req._permissions.session)
			{
				if( req._permissions.permissions.indexOf( permission ) > -1 )
				{
					FormideOS.manager('debug').log( 'Permissions correct' );
					return next();
				}
			}

			FormideOS.manager('debug').log( 'Permissions incorrect' );

			return res.status(401).send({
				status: 401,
				errors: 'No permission'
			});
		}
	}
}