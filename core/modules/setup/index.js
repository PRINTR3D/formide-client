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
			if (err) return FormideOS.manager('debug').log(err, true);
			FormideOS.manager('settings').saveSetting('cloud', 'accesstoken', JSON.parse(body).accessToken);
		}.bind(this));
	},
	
	addUser: function(email, password, cb) {
		FormideOS.manager('db').db.User.find({ cloud: true }).exec(function(err, users) {
			if (users.length > 0) {
				var msg = "There is already a cloud connected user, contact " + users[0].email + " to get access.";
				FormideOS.manager('debug').log(msg, true);
				return cb(msg);
			}
		
			FormideOS.manager('db').db.User.create({
				email: email,
				password: password,
				permissions: [
					"auth",
					"camera",
					"files",
					"led",
					"log",
					"printer",
					"db",
					"slicer",
					"wifi",
					"device",
					"settings"
				],
				cloud: true // indiate that this is a cloud connected user
			}, function(err, user) {
				if (err) return FormideOS.manager('debug').log(err, true);
				return cb();
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