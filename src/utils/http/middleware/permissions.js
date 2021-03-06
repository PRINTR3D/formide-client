/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Permission middleware for http server. Checks if permission is needed by config and if requested
 *	url is inside a module that the user has permission for.
 */

module.exports = {
	check: function(permission, permissionNeeded) {
		if (permissionNeeded === undefined) permissionNeeded = true;
		return function(req, res, next) {
			
			if(!permissionNeeded) {
				return next();
			}
			
			if(req.token) {
				FormideClient.db.AccessToken.findOne({ token: req.token}).exec(function(err, accessToken) {
					if (accessToken) {
						if (FormideClient.permissions.check(accessToken.permissions, permission)) {
							FormideClient.log('Permissions correct');
							return next();
						}
						else {
							FormideClient.log.warn('Permissions incorrect');
							return res.json({
								status: 401,
								errors: 'No permission'
							});
						}
					}
					else {
						FormideClient.log.warn('No access token found in db');
						return res.json({
							status: 401,
							errors: 'No permission'
						});
					}
				});
			}
			else {
				FormideClient.log.error('No token found in request');
				return res.json({
					status: 401,
					errors: 'No permission'
				});
			}
		}
	}
}