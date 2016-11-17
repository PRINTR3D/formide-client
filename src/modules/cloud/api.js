'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const assert  = require('assert');
const os      = require('os');
const request = require('request');
const thenify = require('thenify');

// in seconds
const REGISTRATION_START_TIMEOUT  = 60;  // 1m
const REGISTRATION_FINISH_TIMEOUT = 900; // 15m

// in ms
const REGISTRATION_START_INTERVAL  = 5000;  // 5s
const REGISTRATION_FINISH_INTERVAL = 15000; // 15s

const get  = thenify(request.get);
const post = thenify(request.post);

module.exports = (routes, cloud) => {

	/**
	 * @api {GET} /api/cloud/alive Alive
	 * @apiGroup Cloud
	 * @apiDescription Get alive ping
	 * @apiVersion 1.0.0
	 */
	routes.get('/alive', (req, res) => {
		return res.ok('OK');
	});

	/**
	 * @api {GET} /api/cloud/status Network status
	 * @apiGroup Cloud
	 * @apiDescription Get the current network connection status
	 * @apiVersion 1.0.0
	 */
	routes.get('/status', (req, res) => {
		cloud.getStatus((err, connected) => {
			if (err) return res.serverError(err);
			cloud.getInternalIp((err, internalIp) => {
				if (err) return res.serverError(err);
				connected = connected ? true : false;
				return res.ok({ connected, internalIp });
			});
		});
	});

	/**
	 * @api {GET} /api/cloud/networks Network list
	 * @apiGroup Cloud
	 * @apiDescription Get a list of nearby Wi-Fi networks
	 * @apiVersion 1.0.0
	 */
	routes.get('/networks', (req, res) => {
		cloud.getNetworks((err, networks) => {
			if (err) return res.serverError(err);
			return res.ok(networks);
		});
	});

	/**
	 * @api {GET} /api/cloud/network Current network
	 * @apiGroup Cloud
	 * @apiDescription Get network currently connected to
	 * @apiVersion 1.0.0
	 */
	routes.get('/network', (req, res) => {
		cloud.getNetwork((err, ssid) => {
			if (err) return res.serverError(err);
			return res.ok({ ssid })
		});
	});

	/**
	 * @api {POST} /api/cloud/setup Setup mode
	 * @apiGroup Cloud
	 * @apiDescription Switch to setup mode, enabling The Element's access point
	 * @apiVersion 1.0.0
	 */
	routes.post('/setup', (req, res) => {
		cloud.setupMode(err => {
			if (err) return res.serverError(err);

			// emit event
			FormideClient.events.emit('wifi.reset', { message: `Wi-Fi is now in setup mode` });

			return res.ok({ message: 'Started access point' });
		});
	});

	/**
	 * @api {POST} /api/cloud/wifi Connect Wi-Fi
	 * @apiGroup Cloud
	 * @apiDescription Connect to a Wi-Fi network using SSID and optional password
	 * @apiVersion 1.0.0
	 */
	routes.post('/wifi', (req, res) => {
		if (!req.body.ssid) return res.badRequest('ssid must be set');

		cloud.connect(req.body, err => {
			if (err) return res.serverError(err);

			// emit event
			FormideClient.events.emit('wifi.connected', { message: `Wi-Fi is now connected to ${req.body.ssid}` });

			return res.ok({ message: 'Device connected to network' });
		});
	});

	/**
	 * @api {POST} /api/cloud/connect Connect and register
	 * @apiGroup Cloud
	 * @apiDescription Connect to Wi-Fi and register to Formide cloud using the setup flow
	 * @apiVersion 1.0.0
	 */
	routes.post('/connect', (req, res) => {
		if (!req.body.ssid) return res.badRequest('ssid must be set');
		if (!req.body.registrationToken) return res.badRequest('registrationToken must be set');
		if (!req.body.macAddress) return res.badRequest('macAddress must be set');

		console.log(req.body);

		cloud.connect(req.body, function(err) {
			if (err) return res.serverError(err);

			// emit event
			FormideClient.events.emit('wifi.connected', { message: `Wi-Fi is now connected to ${req.body.ssid}` });

			res.ok({ message: 'Device connected to network' });

			// execute Formide platform registration flow
			const registrationStart = os.uptime();
			FormideClient.log('Waiting for device registration to start');
			return setTimeout(waitForRegistrationStart,
				REGISTRATION_START_INTERVAL,
				registrationStart,
				req.body.macAddress,
				req.body.registrationToken,
				cloud);
		});
	});

	/**
	 * @api {GET} /api/cloud/code Get a setup code
	 * @apiGroup Cloud
	 * @apiDescription Generate a setup code to manually enter on formide.com
	 * @apiVersion 1.4.0
	 */
	routes.get('/code', (req, res) => {
		cloud.generateCode(function (err, code) {
			if (err) return res.notFound(err.message);
			return res.ok({
				code: code,
				message: 'New registration code generated'
			});
		});
	});
};

function waitForRegistrationStart(
	registrationStart, macAddress, registrationToken, cloud) {

	console.log('test2', registrationStart, macAddress, registrationToken);

	assert(registrationStart);
	assert(macAddress);
	assert(registrationToken);
	assert(cloud);

	const registrationEndpoint
		= `${FormideClient.config.get('cloud.url')}/devices/register`;

	FormideClient.log('Trying to create device registration token...');

	post(registrationEndpoint, { form: {
		mac_address:        macAddress,
		registration_token: registrationToken
	}}).then(args => {
		const response = args[0];
		const body     = args[1];

		// If registration token created, wait for registration to finish,
		// else go into setup mode

		const registrationEnd = os.uptime();

		// If MAC not found
		if (response.statusCode == 404) {
			let msg;
			try {
				msg = JSON.parse(body);
				if (msg && msg.message)
					msg = msg.message;

				if (msg)
					msg = `: ${msg}`;
			}
			catch (e) {
				msg = '';
			}

			FormideClient.log(`Failed to create device registration token${msg}`);
			return startSetup(cloud);
		}

		// If device already registered
		else if (response.statusCode == 409)
			// there's nothing else to do
			return FormideClient.log('Device already registered');

		// If timed out
		else if ((registrationEnd - registrationStart)
			>= REGISTRATION_START_TIMEOUT) {

			FormideClient.log('Device registration token creation timed out');

			return startSetup(cloud);
		}

		// If something else not OK
		else if (response.statusCode != 200)
			// retry registration
			return setTimeout(waitForRegistrationStart,
				REGISTRATION_START_INTERVAL,
				registrationStart,
				macAddress,
				registrationToken,
				cloud);

		// Else if everything went well
		FormideClient.log('Waiting for device registration to finish');
		setTimeout(waitForRegistrationFinish,
			REGISTRATION_FINISH_INTERVAL,
			os.uptime(),
			registrationToken,
			cloud);

	}, err => {
		const registrationEnd = os.uptime();
		if ((registrationEnd - registrationStart)
			>= REGISTRATION_START_TIMEOUT) {

			FormideClient.log(
				'Device registration token creation timed out:',
				err.message);

			return startSetup(cloud);
		}

		setTimeout(waitForRegistrationStart,
			REGISTRATION_START_INTERVAL,
			registrationStart,
			macAddress,
			registrationToken,
			cloud);

		return FormideClient.log(err.message);
	});
}

function waitForRegistrationFinish(
	registrationStart, registrationToken, cloud) {

	assert(registrationStart);
	assert(registrationToken);
	assert(cloud);

	const registrationEndpoint
		= `${FormideClient.config.get('cloud.url')}/devices/register`;
	const registrationTokenEndpoint
		= `${registrationEndpoint}/${registrationToken}`;

	FormideClient.log('Checking if device is registered...');

	// Check if if device is still in unregistered state after
	// some time and go into setup mode
	get(registrationTokenEndpoint).then(args => {
		const response        = args[0];
		const registrationEnd = os.uptime();

		// if registration token is not found, device is registered
		if (response.statusCode == 404) {
			return FormideClient.log('Device registered');
		}

		// If more that X time has passed and registration is still
		// not done, go into setup mode
		if ((registrationEnd - registrationStart)
			>= REGISTRATION_FINISH_TIMEOUT) {

			FormideClient.log('Device registration timed out');
			return startSetup(cloud);
		}

		// Else try again
		setTimeout(waitForRegistrationFinish,
			REGISTRATION_FINISH_INTERVAL,
			registrationStart,
			registrationToken,
			cloud);
	}, err => {
		// If more that X time has passed and registration is still
		// not done, go into setup mode
		const registrationEnd = os.uptime();
		if ((registrationEnd - registrationStart)
			>= REGISTRATION_FINISH_TIMEOUT) {

			FormideClient.log(
				'Device registration timed out:',
				err.message);

			return startSetup(cloud);
		}

		setTimeout(waitForRegistrationFinish,
			REGISTRATION_FINISH_INTERVAL,
			registrationStart,
			registrationToken,
			cloud);

		return FormideClient.log(err.message);
	});
}

function startSetup(cloud) {
	cloud.setupMode(err => {
		if (err)
			return FormideClient.log(err.message);
		return FormideClient.log('Switched device into setup mode');
	});
}
