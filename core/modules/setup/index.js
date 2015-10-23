/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var os 			= require('os');
var request 	= require('request');
var net			= require('net');
var getMac		= require('getmac');
var fs			= require('fs');

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
						if (err) return socket.write(JSON.stringify({ err: err.message }));
						return socket.write(JSON.stringify({ result: result }));
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
		
		FormideOS.db.User.findOne({ isOwner: true }).exec(function(err, user) {
			if (err) return cb(err);
			
			if (user) {
				var msg = "This device already has a local owner, contact " + user.email + " to get access.";
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
			}, function(err, user) {
				if (err) return cb(err);
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
							FormideOS.log.warn(response.message);
							// remove new local owner if cloud ownership fails
							FormideOS.db.User.remove({ cloudConnectionToken: registertoken }, function(err) {
								if (err) return cb(err);
								return cb(new Error(response.message));
							});
						}
						else {
							FormideOS.db.User.update({ cloudConnectionToken: registertoken }, { cloudConnectionToken: response.clientToken }, function(err, user) {
								if (err) return cb(err);
								FormideOS.log('cloud user connected with clientToken ' + response.clientToken);
								return cb(null, user);
							});
						}
					});
				});
			});
		});
	},
	
	forceSetupOnReboot: function(callback) {
		var forceSetupFile = FormideOS.config.get('app.storageDir') + "/doSetup";
		fs.exists(forceSetupFile, function(exists) {
			if (!exists) {
				fs.writeFileSync(forceSetupFile, "");
				return callback(null, "file created");
			}
			else {
				return callback(null, "file already exists");
			}
		});
	}
}