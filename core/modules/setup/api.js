/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module)
{
	/**
	 * Get list of networks
	 */
	routes.get('/networks', function(req, res) {
		module.listNetworks(function(networks) {
			res.send(networks);
		});
	});

	/**
	 * Send token and wifi credentials
	 */
	routes.post('/token', function(req, res) {
		module.addUser(req.body.email, req.body.password, req.body.registertoken, function(err, user) {
			if (err) return res.send({ success: false, error: err });
			module.registerToCloud(req.body.wifi_ssid, req.body.wifi_password, user.cloudConnectionToken);
			return res.send({ success: true });
		});
	});
};