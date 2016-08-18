/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	User permission middleware for http server. Checks if permission is needed to use endpoint
 */

module.exports = function(req, res, next) {
	if (req.token) {
		FormideClient.db.AccessToken.findOne({ token: req.token }).exec(function(err, accessToken) {
			if (err) return res.serverError(err);
			if (accessToken) {
				FormideClient.log('Access token found in db');
				if (accessToken.sessionOrigin === 'local') {
					FormideClient.db.User.findOne({ id: accessToken.createdBy }).exec(function (err, user) {
						if (err) return res.serverError(err);
						if (user) {
							FormideClient.log('User found in db');
							req.user = user;
							return next();
						}
						else {
							FormideClient.log.warn('User not found in db');
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
				FormideClient.log.warn('Access token not found in db');
				return res.unauthorized();
			}
		});
	}
	else {
		FormideClient.log.error('No access token found in request');
		return res.unauthorized();
	}
}
