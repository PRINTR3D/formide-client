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
			if (err) return res.serverError(err);
			if (accessToken) {
				FormideOS.log('Access token found in db');
				if (accessToken.sessionOrigin === 'local') {
					FormideOS.db.User.findOne({ id: accessToken.createdBy }).exec(function (err, user) {
						if (err) return res.serverError(err);
						if (user) {
							FormideOS.log('User found in db');
							req.user = user;
							return next();
						}
						else {
							FormideOS.log.warn('User not found in db');
							return res.unauthorized();
						}
					});
				}
				else {
					// TODO: figure out a good way to connect local and cloud user accounts
					req.user = {};
					return next();
				}
			}
			else {
				FormideOS.log.warn('Access token not found in db');
				return res.unauthorized();
			}
		});
	}
	else {
		FormideOS.log.error('No access token found in request');
		return res.unauthorized();
	}
}
