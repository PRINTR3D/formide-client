/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Admin permissions middleware for http server. Checks if admin permission is needed to use api endpoint
 */

module.exports = function(req, res, next) {
	
	// check if user has admin permission
	if(req.token) {
		FormideOS.db.AccessToken.findOne({ token: req.token}).exec(function(err, accessToken) {
			if (accessToken) {
				if (accessToken.permissions.indexOf('admin') > -1) {
					FormideOS.debug.log('Permissions correct');
					return next();
				}
				else {
					FormideOS.debug.log('Permissions incorrect');
					return res.json({
						status: 401,
						errors: 'No admin permission'
					});
				}
			}
			else {
				FormideOS.debug.log('No access token found in db');
				return res.json({
					status: 401,
					errors: 'No admin permission'
				});
			}
		});
	}
	else {
		FormideOS.debug.log('No token found in request');
		return res.json({
			status: 401,
			errors: 'No admin permission'
		});
	}
}