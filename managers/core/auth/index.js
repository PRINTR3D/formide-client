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
	changePassword: function( password, callback )
	{
		FormideOS.manager('core.db').db.User
		.find({where: {id: req.user.id}})
		.success(function( user )
		{
			if( user )
			{
				user
				.updateAttributes({ password: password })
				.success(function()
				{
					return callback({
						status: 200,
						message: 'OK'
					});
				});
			}
			else
			{
				return callback({
					status: 402,
					message: 'cannot change password for unknown user'
				});
			}
		});
	}
}