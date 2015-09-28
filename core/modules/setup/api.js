/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {

	routes.get('/alive', function(req, res) {
		return res.send('OK');
	});

	/**
	 * Send token and wifi credentials
	 */
	routes.post('/register', function(req, res) {
		module.registerOwner(req.body.email, req.body.password, req.body.registertoken, function(err, user) {
			if (err) return res.json({ success: false, error: err });
			return res.json({ success: true, user: user, message: "user registered as owner of this device" });
		});
	});
};