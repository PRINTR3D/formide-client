/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// dependencies
var net 		= require('net');
var request 	= require('request');
var socket 		= require('socket.io-client');
var publicIp 	= require('public-ip');
var internalIp 	= require('internal-ip');
var fs			= require('fs');

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
		
		// init cloud with new socket io client to online cloud url
		this.cloud = socket(config.url);
		this.local = socket( 'ws://127.0.0.1:' + FormideOS.http.server.address().port);

		/*
		 * Connect to the cloud socket server
	 	 */
		this.cloud.on('connect', function() {
			// authenticate formideos based on mac address and api token, also sends permissions for faster blocking via cloud
			publicIp(function (err, ip) {
				var pkg = fs.readFileSync(FormideOS.appRoot + 'package.json', 'utf8');
				pkg = JSON.parse(pkg);
				self.cloud.emit('authenticate', {
					type: 'client',
					mac: FormideOS.macAddress,
					ip: ip,
					ip_internal: internalIp(),
					version: pkg.version,
					environment: FormideOS.config.environment,
					port: FormideOS.config.get('app.port')
				}, function(response) {
					if (response.success) {
						FormideOS.debug.log('Cloud connected');
						
						// forward all events to the cloud
						FormideOS.events.onAny(function(data) {
							self.cloud.emit(this.event, data);
						});
					}
					else {
						// something went wrong when connecting to the cloud
						FormideOS.debug.log('Cloud connection error: ' + response.message);
					}
				});
			});
		});
		
		/*
		 * See if client is online
		 */
		this.cloud.on('ping', function(data, callback) {
			return callback('pong');
		});
		
		/*
		 * This event is triggered when a user logs into the cloud and want to access one of his clients
		 */
		this.cloud.on('authenticateUser', function(data, callback) {
			this.authenticate(data.clientToken, function(err, accessToken) {
				if (err) return callback(err);
				FormideOS.debug.log('Cloud user authorized with access_token ' + accessToken.token);
				return callback(null, accessToken.token);
			});
		}.bind(this));

		/*
		 * HTTP proxy request from cloud
		 */
		this.cloud.on('http', function(data, callback) {
			FormideOS.debug.log('Cloud http call: ' + data.url);
			// call http function
			this.http(data, function(response) {
				callback(response);
			});
		}.bind(this));

		/*
		 * Handle disconnect
	 	 */
		this.cloud.on('disconnect', function() {
			FormideOS.debug.log('Cloud disconnected');
		});
	},

	/*
	 * Handles cloud authentication based on cloudConnectionToken, returns session access_token that cloud uses to perform http calls from then on
	 */
	authenticate: function(cloudConnectionToken, callback) {
		FormideOS.module('db').db.User.findOne({ cloudConnectionToken: cloudConnectionToken }).exec(function(err, user) {
			if (err) return callback(err);
			if (!user) return callback({ success: false, message: 'no user found with this cloud connection token' });
			FormideOS.module('db').db.AccessToken.generate(user, 'cloud', function(err, accessToken) {
				if (err) return callback(err);
				return callback(null, accessToken);
			});
		});
	},

	/*
	 * Handles HTTP proxy function calls from cloud connection, calls own local http api after reconstructing HTTP request
	 */
	http: function(data, callback) {
		request({
			method: data.method,
			uri: 'http://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.url,
			auth: {
				bearer: data.token // add cloud api key to authorise to local HTTP api
			},
			form: data.data || {}
		}, function( error, response, body ) {
			return callback(body);
		});
	}
}