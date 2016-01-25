'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const request = require('request');

module.exports = (routes, module) => {

	/**
	 * Check if device is found for setup.formide.com
	 */
	routes.get('/alive', (req, res) => {
		return res.ok('OK');
	});

	/**
	 * Get the current network connection status
	 */
	routes.get('/status', (req, res) => {
		module.getStatus((err, status) => {
			if (err) return res.serverError(err);
			return res.ok(status);
		});
	});

	/**
	 * List nearby networks
	 */
	routes.get('/networks', (req, res) => {
		module.getNetworks((err, networks) => {
			if (err) return res.serverError(err);
			return res.ok(networks);
		});
	});

	/**
	 * Go to setup mode (enable AP)
	 */
	routes.post('/setup', (req, res) => {
		module.setupMode(err => {
			if (err) return res.serverError(err);
			return res.ok({ message: 'Started access point' });
		});
	});

	/**
	 * Connect to wifi
	 */
	routes.post('/wifi', (req, res) => {
		if (req.body.ssid == null)
			return res.badRequest('ssid must be set');
		if (req.body.password == null)
			return res.badRequest('password must be set');

		module.connect(req.body.ssid, req.body.password, err => {
			if (err)
				return res.serverError(err);

			res.ok({ message: 'Device connected to network' });
		});
	});

	/**
	 * Connect to wifi and register to cloud
	 */
	routes.post('/connect', (req, res) => {
		if (req.body.ssid == null)
			return res.badRequest('ssid must be set');
		if (req.body.password == null)
			return res.badRequest('password must be set');
		if (req.body.macAddress == null)
			return res.badRequest('macAddress must be set');
		if (req.body.registrationToken == null)
			return res.badRequest('registrationToken must be set');

		module.connect(req.body.ssid, req.body.password, err => {
			if (err)
				return res.serverError(err);

			res.ok({ message: 'Device connected to network' });

			var tryRegister = setInterval(function() {
				request.post(
					`${FormideOS.config.get('cloud.url')}/devices/register`,
					{ form: {
						mac_address:        req.body.macAddress,
						registration_token: req.body.registrationToken
					}},
					(err, response, body) => {
						if (err) return FormideOS.log(err.message);

						// clear interval when getting a proper response from the API
						clearInterval(tryRegister);

						if (response.statusCode == 200) return FormideOS.log('Device registered');
						return FormideOS.log('Device registration failed: ' + body);
					});
			}, 3000);
		});
	});
};
