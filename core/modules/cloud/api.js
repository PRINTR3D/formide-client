/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {
	
	/**
	 * Check if device is found for setup.formide.com
	 */
	routes.get('/alive', function(req, res) {
		return res.send('OK');
	});
	
	/**
	 * Register device to owner in cloud
	 */
	routes.post('/register', function(req, res) {
		module.registerDevice(req.body.ownerEmail, req.body.ownerPassword, req.body.registerToken, function(err, user) {
			if (err) return res.status(400).json({ success: false, message: err.message });
			return res.json({ success: true, message: "user created and registered as owner of this device" });
		});
	});
};