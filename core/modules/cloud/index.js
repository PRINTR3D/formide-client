/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
 */

// dependencies
var net 		= require('net');
var request 	= require('request');
var socket 		= require('socket.io-client');

module.exports =
{	
	cloud: {},
	local: [],

	/*
	 * Init for cloud module
	 */
	init: function(config) {
		
		// init cloud with new socket io client to online cloud url
		this.cloud = socket(config.url);

		// when connecting to cloud
		this.cloud.on('connect', function() {
			// authenticate formideos based on mac address and api token, also sends permissions for faster blocking via cloud
			this.cloud.emit('authenticate', {
				type: 'client',
				mac: FormideOS.macAddress,
				deviceUUID: FormideOS.macAddress // for now
			});
			FormideOS.debug.log('Cloud connected');
		}.bind(this));
		
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

		// on http proxy request
		this.cloud.on('http', function(data, callback) {
			FormideOS.debug.log('Cloud http call: ' + data.url);
			// call http function
			this.http(data, function(response) {
				callback(response);
			});
		}.bind(this));

		// on ws proxy request
		this.cloud.on('listen', function(data, callback) {
			FormideOS.debug.log('Cloud ws listen: ' + data.module + '.' + data.channel);
			// call listen function
			this.listen(data, function(response) {
				callback(response);
			});
		}.bind(this));

		// emit ws to cloud
		this.cloud.on('emit', function(data, callback) {
			FormideOS.debug.log('Cloud ws emit: ' + data.module + '.' + data.channel);
			// call emit function
			this.emit(data);
		}.bind(this));

		// when disconnecting
		this.cloud.on('disconnect', function() {
			FormideOS.debug.log('Cloud diconnected');
		});
	},
	
/*
	exposeSettings: function() {
		var moduleSettings = [];
		
		moduleSettings.push({
			name: "accesstoken",
			label: "Access token",
			description: "The access token used by the cloud to reach FormideOS. Don't change if you're not sure what this is!",
			type: "text",
			default: "no_key",
			required: true
		});
		
		for(var i in FormideOS.moduleManager.getModules()) {
			moduleSettings.push({
				type: "checkbox",
				label: i + " cloud permission",
				name: "permission_" + i,
				required: true,
				default: true
			});
		}
		
		return moduleSettings;
	},
*/

	/*
	 * Handles cloud authentication based on cloudConnectionToken, returns session access_token that cloud uses to perform http calls from then on
	 */
	authenticate: function(cloudConnectionToken, callback) {
		FormideOS.module('db').db.User.findOne({ cloudConnectionToken: cloudConnectionToken }).exec(function(err, user) {
			if (err) return callback(err);
			if (!user) return callback('no user found with this cloud connection token');
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
	},

	/*
	 * Handles WS proxy call from cloud connection, calls own local ws server and relays calls 
	 */
	listen: function(data, callback) {
		var self = this;
		if(!this.local[data.module]) {
			this.local[data.module] = socket( 'ws://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.module);
		}
		this.local[data.module].on(data.channel, function(response) {
			self.cloud.emit(data.module + "." + data.channel, response);
		});
	},

	/*
	 * Handles WS emits to proxy (printer status/logs/slicer status), relays local emits to cloud
	 */
	emit: function(data) {
		var self = this;
		if(!this.local[data.module]) {
			this.local[data.module] = socket( 'ws://127.0.0.1:' + FormideOS.http.server.address().port + '/' + data.module);
		}
		this.local[data.module].emit(data.channel, data.data);
	}
}