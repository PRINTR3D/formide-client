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

	registerToCloud: function( ssid, password, registertoken ) {
		request({
			method: "POST",
			url: this.config.registerUrl,
			form:{
				mac: FormideOS.macAddress,
				registertoken: registertoken
			},
			strictSSL: false
		}, function( err, httpResponse, body ) {
			if (err) return FormideOS.debug.log(err, true);
			var response = JSON.parse(body);
			FormideOS.module('db').db.User.update({ cloudConnectionToken: registertoken }, { cloudConnectionToken: response.clientToken }, function(err, user) {
				FormideOS.debug.log('cloud user connected with clientToken ' + response.clientToken);
			});
		}.bind(this));
	},
	
	addUser: function(email, password, registertoken, cb) {
		FormideOS.module('db').db.User.find({ cloudConnectionToken: {'$ne': null } }).exec(function(err, users) {
			if (users.length > 0) {
				var msg = "There is already a cloud connected user, contact " + users[0].email + " to get access.";
				FormideOS.debug.log(msg, true);
				return cb(msg);
			}
		
			FormideOS.module('db').db.User.create({
				email: email,
				password: password,
				permissions: FormideOS.permissions.get(),
				cloudConnectionToken: registertoken
			}, function(err, user) {
				if (err) return cb(err);
				return cb(null, user);
			});
		});
	},

	// TODO: unfake :P
	listNetworks: function( callback ) {
		networks = [
			{
				"ssid": "Printhom",
				"security": "WPA2",
				"signal": 70
			},
			{
				"ssid": "MyWifiNetwork",
				"security": "WPA",
				"signal": 65
			}
		];
		callback( networks );
	}
}