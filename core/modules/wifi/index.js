/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var exec = require('child_process').exec;
var async = require('async');
var fs = require('fs');
var wifiscanner = require('node-wifiscanner');

module.exports = {
	
	startAp: false,
	sudoPasswd: 'debian',
	iface: 'wlan0',
	
	init: function() {
		// init
		var setupFile = FormideOS.config.get('app.storageDir') + '/setupdone';
		var wifiConfig = FormideOS.settings.get('wifi');
		
		if (fs.existsSync(setupFile)) {
			this.connectToNetwork(wifiConfig.ssid, wifiConfig.password, function(err, result) {
				console.log(err, result);
			});
		}
		else {
			this.setupAccessPoint(function(err, result) {
				console.log(err, result);
			});
		}
	},
	
	list: function(callback) {
		wifiscanner.scan(function(err, data){
		    if (err) {
		        console.log("Error : " + err);
		        return callback(err);
		    }
		    return callback(null, data);
		});	
	},

	rebootInterface: function(iface, middleware, callback) {
		var self = this;
		async.series([
			function down(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S ifdown " + self.iface, function(error, stdout, stderr) {
					if (!error) {
						console.log("ifdown " + self.iface + " successful...");
						return next(error);
					}
                    return next();
				});
			},
			function up(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S ifup " + self.iface, function(error, stdout, stderr) {
					if (!error) {
						console.log("ifup " + self.iface + " successful...");
						return next(error);
					}
                    return next();
				});
			}
		], function(err) {
			if (err) return callback(err);
			return callback(null, 'rebooted');
		});
	},
	
	setupAccessPoint: function(callback) {
		var self = this;
		async.series([
			function down(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S ifdown " + self.iface, function(error, stdout, stderr) {
					if (!error) {
						console.log("ifdown " + self.iface + " successful...");
						return next(error);
					}
                    return next();
				});
			},
			function setupAP(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S sh apSetup.sh", { cwd: __dirname }, function(error, stdout, stderr) {
					if (!error) {
						console.log("ap setup successful...");
						return next(error);
					}
	                return next();
				});
			},
			function up(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S ifup " + self.iface, function(error, stdout, stderr) {
					if (!error) {
						console.log("ifup " + self.iface + " successful...");
						return next(error);
					}
                    return next();
				});
			}
		], function(err) {
			if (err) return callback(err);
			return callback(null, 'switched to ap');
		});
	},
	
	connectToNetwork: function(ssid, password, callback) {
		var self = this;
		async.series([
			function down(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S ifdown " + self.iface, function(error, stdout, stderr) {
					if (!error) {
						console.log("ifdown " + self.iface + " successful...");
						return next(error);
					}
                    return next();
				});
			},
			function setupAP(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S sh clientSetup.sh " + ssid + " " + password, { cwd: __dirname }, function(error, stdout, stderr) {
					if (!error) {
						console.log("client setup successful...");
						return next(error);
					}
	                return next();
				});
			},
			function up(next) {
				exec("echo " + self.sudoPasswd + " | sudo -S ifup " + self.iface, function(error, stdout, stderr) {
					if (!error) {
						console.log("ifup " + self.iface + " successful...");
						return next(error);
					}
                    return next();
				});
			}
		], function(err) {
			if (err) return callback(err);
			return callback(null, 'switched to network');
		});
	}
}