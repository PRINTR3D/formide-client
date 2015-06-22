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

module.exports = {
	check: function(permission, permissionNeeded) {
		if (permissionNeeded === undefined) permissionNeeded = true;
		return function(req, res, next) {
			
			if(!permissionNeeded) {
				return next();
			}
			
			if(req.token) {
				FormideOS.module('db').db.AccessToken.findOne({ token: req.token}).exec(function(err, accessToken) {
					if (accessToken) {
						if (accessToken.permissions.indexOf(permission) > -1) {
							FormideOS.debug.log('Permissions correct');
							return next();
						}
						else {
							FormideOS.debug.log('Permissions incorrect');
							return res.json({
								status: 401,
								errors: 'No permission'
							});
						}
					}
					else {
						console.log('test');
					}
				});
			}
			else {
				FormideOS.debug.log('No token found');
				return res.json({
					status: 401,
					errors: 'No permission'
				});
			}
		}
	}
}