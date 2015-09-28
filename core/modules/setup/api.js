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
		module.registerOwner(req.body.ownerEmail, req.body.ownerPassword, req.body.registerToken, function(err, user) {
			if (err) return res.status(400).json({ success: false, message: err.message });
			return res.json({ success: true, user: user, message: "user registered as owner of this device" });
		});
	});
	
	routes.port('/forcesetuponreboot', function(req, res) {
		module.forceSetupOnReboot(req.body.force, function(err, result) {
			if (err) return res.status(400).json({ success: false, message: err.message });
			return res.json({ success: true, force: req.body.force, result: result });
		})
	});
};