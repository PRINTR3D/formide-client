'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const assert  = require('assert');
const moment  = require('moment');
const request = require('request');
const thenify = require('thenify');

// in minutes
const REGISTRATION_START_TIMEOUT  = 1;
const REGISTRATION_FINISH_TIMEOUT = 15;

// in ms
const REGISTRATION_START_INTERVAL  = 5000;  // 5s
const REGISTRATION_FINISH_INTERVAL = 15000; // 15s

const get  = thenify(request.get);
const post = thenify(request.post);

module.exports = (routes, cloud) => {

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
		cloud.getStatus((err, connected) => {
			if (err) return res.serverError(err);
			if (connected) return res.ok({ connected: true });
			return res.ok({ connected: false });
		});
	});

	/**
	 * List nearby networks
	 */
	routes.get('/networks', (req, res) => {
		cloud.getNetworks((err, networks) => {
			if (err) return res.serverError(err);
			return res.ok(networks);
		});
	});

	/**
	 * Go to setup mode (i.e. enable AP)
	 */
	routes.post('/setup', (req, res) => {
		cloud.setupMode(err => {
			if (err) return res.serverError(err);
			return res.ok({ message: 'Started access point' });
		});
	});

	/**
	 * Connect to WiFi
	 */
	routes.post('/wifi', (req, res) => {
		if (req.body.ssid == null)
			return res.badRequest('ssid must be set');
		if (req.body.password == null)
			return res.badRequest('password must be set');

		cloud.connect(req.body.ssid, req.body.password, err => {
			if (err)
				return res.serverError(err);

			res.ok({ message: 'Device connected to network' });
		});
	});

	/**
	 * Connect to WiFi and register to cloud
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

		cloud.connect(req.body.ssid, req.body.password, err => {
			if (err)
				return res.serverError(err);

			res.ok({ message: 'Device connected to network' });

			const registrationStart = moment.utc();
			FormideOS.log('Waiting for device registration to start');
			setTimeout(waitForRegistrationStart,
				REGISTRATION_START_INTERVAL,
				registrationStart,
				req.body.macAddress,
				req.body.registrationToken,
				cloud);
		});
	});
};

function waitForRegistrationStart(
	registrationStart, macAddress, registrationToken, cloud) {

	assert(registrationStart);
	assert(macAddress);
	assert(registrationToken);
	assert(cloud);

	const registrationEndpoint
		= `${FormideOS.config.get('cloud.url')}/devices/register`;

	FormideOS.log('Trying to create device registration token...');

	post(registrationEndpoint, { form: {
		mac_address:        macAddress,
		registration_token: registrationToken
	}}).then(args => {
		const response = args[0];
		const body     = args[1];

		// If registration token created, wait for registration to finish,
		// else go into setup mode

		const registrationEnd = moment.utc();

		// If MAC not found or device already registered
		if (response.statusCode == 404 || response.statusCode == 409) {
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

			FormideOS.log(`Failed to create device registration token${msg}`);
			return startSetup(cloud);
		}

		// If timed out
		else if (registrationEnd.diff(registrationStart, 'minutes')
			>= REGISTRATION_START_TIMEOUT) {

			FormideOS.log('Device registration token creation timed out');

			return startSetup(cloud);
		}

		// If something else not OK
		else if (response.statusCode != 200)
			return setTimeout(waitForRegistrationStart,
				REGISTRATION_START_INTERVAL,
				registrationStart,
				macAddress,
				registrationToken,
				cloud);

		FormideOS.log('Waiting for device registration to finish');
		// Else if everything went well
		setTimeout(waitForRegistrationFinish,
			REGISTRATION_FINISH_INTERVAL,
			moment.utc(),
			registrationToken,
			cloud);

	}, err => {
		const registrationEnd = moment.utc();
		if (registrationEnd.diff(registrationStart, 'minutes')
			>= REGISTRATION_START_TIMEOUT) {

			FormideOS.log(
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

		return FormideOS.log(err.message);
	});
}

function waitForRegistrationFinish(
	registrationStart, registrationToken, cloud) {

	assert(registrationStart);
	assert(registrationToken);
	assert(cloud);

	const registrationEndpoint
		= `${FormideOS.config.get('cloud.url')}/devices/register`;
	const registrationTokenEndpoint
		= `${registrationEndpoint}/${registrationToken}`;

	FormideOS.log('Checking if device is registered...');

	// Check if if device is still in unregistered state after
	// some time and go into setup mode
	get(registrationTokenEndpoint).then(args => {
		const response        = args[0];
		const registrationEnd = moment.utc();

		// if registration token is not found, device is registered
		if (response.statusCode == 404) {
			return FormideOS.log('Device registered');
		}

		// If more that X time has passed and registration is still
		// not done, go into setup mode
		if (registrationEnd.diff(registrationStart, 'minutes')
			>= REGISTRATION_FINISH_TIMEOUT) {
			FormideOS.log('Device registration timed out');
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
		const registrationEnd = moment.utc();
		if (registrationEnd.diff(registrationStart, 'minutes')
			>= REGISTRATION_FINISH_TIMEOUT) {

			FormideOS.log(
				'Device registration timed out:',
				err.message);

			return startSetup(cloud);
		}

		setTimeout(waitForRegistrationFinish,
			REGISTRATION_FINISH_INTERVAL,
			registrationStart,
			registrationToken,
			cloud);

		return FormideOS.log(err.message);
	});
}

function startSetup(cloud) {
	cloud.setupMode(err => {
		if (err)
			return FormideOS.log(err.message);
		return FormideOS.log('Switched device into setup mode');
	});
}
