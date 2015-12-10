/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, module) => {

	/**
	 * Check if device is found for setup.formide.com
	 */
	routes.get('/alive', (req, res) => {
		return res.ok('OK');
	});

	/**
	 * Register device to owner in cloud
	 */
	routes.post('/register', (req, res) => {
		// TODO: register existing local user as owner instead of creating new one
		module.registerDevice(req.body.ownerEmail, req.body.ownerPassword, req.body.registerToken, function(err, user) {
			if (err) return res.badRequest(err.message);
			return res.ok({ message: "User created and registered as owner" });
		});
	});
};
