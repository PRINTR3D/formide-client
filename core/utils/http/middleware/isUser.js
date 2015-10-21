/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	User permission middleware for http server. Checks if permission is needed to use endpoint
 */

module.exports = function(req, res, next) {
	if (req.token) {
		FormideOS.db.AccessToken.findOne({ token: req.token }).exec(function(err, accessToken) {
			if (accessToken) {
				FormideOS.debug.log('Access token found in db');
				return next();
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
		FormideOS.debug.log('No access token found in request');
		return res.json({
			status: 401,
			errors: 'No permission'
		});
	}
}