/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var os 			= require('os');
var request 	= require('request');

module.exports = {

	config: {},

	init: function(config) {
		this.config = config;
	},
	
	
	registerOwner: function(owner_email, owner_password, wifi_ssid, wifi_password, registertoken, cb) {
		
		var self = this;
		
		FormideOS.module('db').db.User.findOne({ isOwner: true }).exec(function(err, user) {
			if (user) {
				var msg = "This device already has a local owner, contact " + user.email + " to get access.";
				FormideOS.debug.log(msg, true);
				return cb(msg);
			}
			
			// TODO: wifi setup
			
			// create a new owner/admin user
			FormideOS.module('db').db.User.create({
				email: owner_email,
				password: owner_password,
				isOwner: true,
				isAdmin: true,
				cloudConnectionToken: registertoken
			}, function(err, user) {
				if (err) return cb(err.message);
				request({
					method: "POST",
					url: self.config.registerUrl,
					form:{
						mac: FormideOS.macAddress,
						registertoken: registertoken
					},
					strictSSL: false
				}, function( err, httpResponse, body ) {
					if (err) return cb(err.message);
					var response = JSON.parse(body);
					if (!response.clientToken) {
						FormideOS.debug.log(response.message, true);
						return cb(response.message);
					}
					FormideOS.module('db').db.User.update({ cloudConnectionToken: registertoken }, { cloudConnectionToken: response.clientToken }, function(err, user) {
						if (err) return cb(err.message);
						FormideOS.debug.log('cloud user connected with clientToken ' + response.clientToken);
						return cb(null, user);
					});
				});
			});
		});
	},

	// TODO: unfake :P
	listNetworks: function( callback ) {
		networks = [
			{
				"ssid": "MyWifiNetwork",
				"security": "WPA2",
				"signal": 65
			}
		];
		callback( networks );
	}
}