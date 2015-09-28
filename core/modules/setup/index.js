/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var os 			= require('os');
var request 	= require('request');
var net			= require('net');
var getMac		= require('getmac');

module.exports = {

	config: {},

	init: function(config) {
		var self = this;
		this.config = config;
		
		// tcp server to connect to element-tools application for element setup usage
		var server = net.createServer(function(socket) {
			socket.on('data', function(data) {
				try {
					var message = JSON.parse(data);
					self.registerOwner(message.ownerEmail, message.ownerPassword, message.registerToken, function(err, result) {
						socket.write(JSON.stringify({ err: err.message, result: result }));
						return;
					});
				}
				catch(e) {
					socket.write(JSON.stringify({ err: e.message }));
					return;
				}
			});
		});
		
		server.listen(1338, '127.0.0.1');
	},
	
	
	registerOwner: function(owner_email, owner_password, registertoken, cb) {
		var self = this;
		
		FormideOS.module('db').db.User.findOne({ isOwner: true }).exec(function(err, user) {
			if (user) {
				var msg = "This device already has a local owner, contact " + user.email + " to get access.";
				FormideOS.debug.log(msg, true);
				return cb(new Error(msg));
			}
			
			// create a new owner/admin user
			FormideOS.module('db').db.User.create({
				email: owner_email,
				password: owner_password,
				isOwner: true,
				isAdmin: true,
				cloudConnectionToken: registertoken
			}, function(err, user) {
				if (err) return cb(err.message);
				getMac.getMac(function(err, macAddress) {
					if (err) return cb(err);
					request({
						method: "POST",
						url: self.config.registerUrl,
						form:{
							mac: macAddress,
							registertoken: registertoken
						},
						strictSSL: false
					}, function( err, httpResponse, body ) {
						if (err) return cb(err);
						var response = JSON.parse(body);
						if (!response.clientToken) {
							FormideOS.debug.log(response.message, true);
							return cb(new Error(response.message));
						}
						FormideOS.module('db').db.User.update({ cloudConnectionToken: registertoken }, { cloudConnectionToken: response.clientToken }, function(err, user) {
							if (err) return cb(err.message);
							FormideOS.debug.log('cloud user connected with clientToken ' + response.clientToken);
							return cb(null, user);
						});
					});
				});
			});
		});
	}
}