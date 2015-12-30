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

	routes.post('/setup', (req, res) => {
		module.setupMode(err => {
			if (err) return res.serverError(err.message);
			return res.ok({ message: 'Started access point' });
		});
	});

	/**
	 * Connect to a network
	 */
	routest.post('/connect', (req, res) => {
		module.connect((err, success) => {
			if (err) return res.serverError(err.message);
			return res.ok({ message: 'Device connected to network' });
		});
	});

	/**
	 * Register device to owner in cloud
	 */
	routes.post('/register', (req, res) => {
		module.registerDevice(req.body.accessToken, function(err, user) {
			if (err) return res.badRequest(err.message);
			return res.ok({ message: 'Device registered' });
		});
	});
};
