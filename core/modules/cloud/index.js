'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var net 		= require('net');
var request 	= require('request');
var socket 		= require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var publicIp 	= require('public-ip');
var internalIp 	= require('internal-ip');
var fs			= require('fs');
var uuid		= require('node-uuid');
var async		= require('async');
var getMac		= require('getmac');

module.exports =
{
	// socket connections
	cloud: null,
	local: null,

	/*
	 * Init for cloud module
	 */
	init: function(config) {

		// use self to prevent bind(this) waterfall
		var self = this;

		function forwardEvents(data) {
			self.cloud.emit(this.event, data);
		}

		// init cloud with new socket io client to online cloud url
		this.cloud = socket(config.url);
		this.local = socket('ws://127.0.0.1:' + FormideOS.http.server.address().port);

		// handle cloud connection error
		this.cloud.on('error', function (err) {
			FormideOS.log.error("Error connecting to cloud: " + err);
		});

		/*
		 * Connect to the cloud socket server
	 	 */
		this.cloud.on('connect', function () {

			// authenticate formideos based on mac address and api token, also sends permissions for faster blocking via cloud
			publicIp(function (err, ip) {
				getMac.getMac(function(err, macAddress) {
					var pkg = fs.readFileSync(FormideOS.appRoot + 'package.json', 'utf8');
					pkg = JSON.parse(pkg);
					self.cloud.emit('authenticate', {
						type: 'client',
						mac: macAddress,
						ip: ip,
						ip_internal: internalIp(),
						version: pkg.version,
						environment: FormideOS.config.environment,
						port: FormideOS.config.get('app.port')
					}, function(response) {
						if (response.success) {
							FormideOS.log('Cloud connected');

							// forward all events to the cloud
							FormideOS.events.onAny(forwardEvents);
						}
						else {
							// something went wrong when connecting to the cloud
							FormideOS.log.error('Cloud connection error: ' + response.message);
						}
					});
				});
			});
		});

		/*
		 * See if client is online
		 */
		this.cloud.on('ping', data => {
			self.cloud.emit('pong', data);
		});

		/*
		 * This event is triggered when a user logs into the cloud and want to access one of his clients
		 */
		this.cloud.on('authenticateUser', data => {
			FormideOS.log("Cloud authenticate user:" + data.id);
			this.authenticate(data, (err, accessToken) => {
				FormideOS.log('Cloud user authorized with access_token ' + accessToken.token);
				self.cloud.emit('authenticateUser', {
					_callbackId: data._callbackId,
					result:      accessToken.token
				});
			});
		});

		/*
		 * HTTP proxy request from cloud
		 */
		this.cloud.on('http', data => {
			FormideOS.log('Cloud http call: ' + data.url);
			// call http function
			this.http(data, (err, response) => {
				self.cloud.emit('http', {
					_callbackId: data._callbackId,
					result:      response
				});
			});
		});

		/*
		 * Send a gcode file to a client to print a cloud sliced printjob
		 */
		this.cloud.on('addToQueue', data => {
			FormideOS.log('Cloud addToQueue: ' + data.hash);
			self.addToQueue(data, (err, response) => {
				self.cloud.emit('addToQueue', {
					_callbackId: data._callbackId,
					result:      response
				});
			});
		});

		/*
		 * Handle disconnect
	 	 */
		this.cloud.on('disconnect', () => {
			// turn off event forwarding
			FormideOS.events.offAny(forwardEvents);

			FormideOS.log('Cloud disconnected');
		});
	},

	/*
	 * Handles cloud authentication based on cloudConnectionToken, returns session access_token that cloud uses to perform http calls from then on
	 */
	authenticate: function(data, callback) {
		var permissions = [];
		if (data.isOwner) permissions.push("owner");
		if (data.isAdmin) permissions.push("admin");
		FormideOS.db.AccessToken.create({
			permissions: permissions,
			sessionOrigin: "cloud"
		}, function (err, accessToken) {
			if (err) return callback(err);
			return callback(null, accessToken);
		});
	},

	/*
	 * Handles HTTP proxy function calls from cloud connection, calls own local http api after reconstructing HTTP request
	 */
	http: function(data, callback) {
		if (data.method === 'GET') {
			request({
				method: 'GET',
				uri: 'http://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.url,
				auth: {
					bearer: data.token // add cloud api key to authorise to local HTTP api
				},
				qs: data.data
			}, function( error, response, body ) {
				if (error) return callback(error);
				return callback(null, body);
			});
		}
		else {
			request({
				method: data.method,
				uri: 'http://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.url,
				auth: {
					bearer: data.token // add cloud api key to authorise to local HTTP api
				},
				form: data.data
			}, function( error, response, body ) {
				if (error) return callback(error);
				return callback(null, body);
			});
		}
	},

	/*
	 * Handles addToQueue from cloud
	 */
	addToQueue: function(data, callback) {
		var self = this;
		var hash = uuid.v4();

		FormideOS.db.QueueItem.create({
			origin: 'cloud',
			status: 'queued',
			gcode: hash,
			printjob: data.printjob,
			port: data.port
		}, function(err, queueitem) {
			if (err) return callback(err);
			callback(null, {
				success: true,
				queueitem: queueitem
			});

			// TODO: better way of fetching gcode files from cloud
			request({
				method: 'GET',
				url: FormideOS.config.get('cloud.url') + '/files/download/gcode',
				qs: {
					hash: data.hash
				},
				strictSSL: false
			})
			.on('response', function(response) {
				var newPath = FormideOS.config.get('app.storageDir') + FormideOS.config.get('paths.gcode') + '/' + hash;
				var fws = fs.createWriteStream(newPath);
				response.pipe(fws);
				response.on( 'end', function() {
					FormideOS.log('finished downloading gcode. Recieved ' + fws.bytesWritten + ' bytes');
	        	});
			});
		});
	},

	/*
	 * Register device in cloud
	 */
	registerDevice: function (owner_email, owner_password, registertoken, cb) {
		var self = this;

		FormideOS.db.User.findOne({
			isOwner: true
		}, function (err, user) {
			if (err) return cb(err);
			if (user) {
				var msg = "this device already has a local owner, please contact " + user.email + " to request access to this device.";
				FormideOS.log.warn(msg);
				return cb(new Error(msg));
			}
			// create a new owner/admin user
			FormideOS.db.User.create({
				email: owner_email,
				password: owner_password,
				isOwner: true,
				isAdmin: true,
				cloudConnectionToken: registertoken
			}, function (err, user) {
				if (err) return cb(err);
				getMac.getMac(function (err, macAddress) {
					if (err) return cb(err);
					self.cloud.emit("register", {
						mac: macAddress,
						registerToken: registertoken
					}, function (response) {
						if (response.success === false || !response.deviceToken) {
							FormideOS.log.error(response.message);
							FormideOS.db.User.destroy({
								cloudConnectionToken: registertoken
							}, function (err) {
								if (err) return cb(err);
								return cb(new Error("Error registering device: " + response.reason));
							});
						}
						else {
							FormideOS.db.User.update({ cloudConnectionToken: registertoken }, { cloudConnectionToken: response.deviceToken }, function (err, updated) {
								if (err) return cb(err);
								FormideOS.log('cloud user connected with clientToken ' + response.deviceToken);
								return cb(null, updated[0]);
							});
						}
					});
				});
			});
		});
	}
}
