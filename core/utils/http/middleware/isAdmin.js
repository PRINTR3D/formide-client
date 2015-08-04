/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Admin permissions middleware for http server. Checks if admin permission is needed to use api endpoint
 */

module.exports = function(req, res, next) {
	
	// check if user has admin permission
	
	
	
/*
	check: function(permission, permissionNeeded) {
		if (permissionNeeded === undefined) permissionNeeded = true;
		return function(req, res, next) {
			
			if(!permissionNeeded) {
				return next();
			}
			
			if(req.token) {
				FormideOS.module('db').db.AccessToken.findOne({ token: req.token}).exec(function(err, accessToken) {
					if (accessToken) {
						if (FormideOS.permissions.check(accessToken.permissions, permission)) {
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
						FormideOS.debug.log('No access token found in db');
						return res.json({
							status: 401,
							errors: 'No permission'
						});
					}
				});
			}
			else {
				FormideOS.debug.log('No token found in request');
				return res.json({
					status: 401,
					errors: 'No permission'
				});
			}
		}
	}
*/
}