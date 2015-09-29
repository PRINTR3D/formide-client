/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
var fs 			= require('fs');
var npm 		= require('npm');
var path		= require('path');
var exec 		= require('child_process').exec;

module.exports = {
	
	// update system
	updateOS: function(cb) {
		FormideOS.debug.log('Started update');
		
		// wait 2 seconds before sending updated.started
		setTimeout(function() {
			FormideOS.events.emit('update.started', {});
		}, 2000);
		
		cb(null, "Started update");
		var child = exec('npm install formide-client -g', function (error, stdout, stderr) {
			if (stderr !== null) {
				FormideOS.debug.log('Finished update');
				FormideOS.events.emit('update.finished', { message: stdout });
				//cb(null, stderr);
			}
			if (stdout !== null) {
				FormideOS.debug.log('Finished update');
				FormideOS.events.emit('update.finished', { message: stdout });
				//cb(null, stdout);
    		}
			if (error !== null) {
				FormideOS.debug.log('Failed update with error: ' + error);
				FormideOS.events.emit('update.failed', { message: error });
				//cb(error);
    		}
		});
	},
	
	reboot: function(cb) {
		// do reboot of device
	},
	
	getPackages: function(simple, cb) {
		var response = [];
		for(var i in FormideOS.moduleManager.getModules()) {
			if (simple) {
				response.push(i);
			}
			else {
				response.push(FormideOS.moduleManager.getModuleInfo(i));
			}
		}
		return cb(response);
	},
	
	getPackage: function(packageName, cb) {
		return cb(FormideOS.moduleManager.getModuleInfo(packageName));
	},
	
/*
	updatePackages: function(cb) {
		var self = this;
		npm.load({ save: true }, function (err) {
			if (err) return cb(err);
			self.getPackages(true, function(packages) {
				npm.commands.update(packages, function (updateErr, data) {
					if (updateErr) return cb(err);
					if (data !== undefined) {
						for(var i in data) {
							var udpatedPackage = data[i];
							
						}
						
						console.log(data);
						//FormideOS.reload();
					}
					return cb(null, data);
	  			});
			});
		});
	},
*/
	
	updateSinglePackage: function(packageName, cb) {
		var self = this;
		npm.load(function (err) {
			if (err) return cb(err);
			npm.commands.install([packageName + '@latest'], function (updateErr, data) {
				if (updateErr) return cb(updateErr);
				if (data !== undefined) {
					FormideOS.moduleManager.reloadModule(packageName);
				}
				return cb(null, data);
  			});
		});
	},
	
	installPackage: function(packageName, cb) {
		var modules = FormideOS.settings.get('update', 'modules');
		if(modules.indexOf(packageName) > -1) {
			return cb(true, "package already installed");
		}
		else {
			npm.load({ save: true }, function (err) {
				if (err) return cb(err);
				npm.commands.install([packageName + '@latest'], function (installErr, data) {
					if (installErr) return cb(installErr);
					FormideOS.modules.push(packagename);
					if (data !== undefined) {
						FormideOS.moduleManager.loadModule('node_modules/' + packageName, packageName, false);
						FormideOS.moduleManager.activateModule(packageName);
					}
					return cb(null, data);
	  			});
			});
		}
	},
	
	uninstallPackage: function(packageName, cb) {
		npm.load(function (err) {
			if (err) return cb(err);
			npm.commands.uninstall([packageName], function (uninstallErr, data) {
				if (uninstallErr) return cb(uninstallErr);
				var modules = FormideOS.modules;
				var index = modules.indexOf(packageName);
				modules.splice(index, 1);
				if (data !== undefined) {
					FormideOS.moduleManager.disposeModule(packageName);
				}
				return cb(null, data);
  			});
		});
	},
	
	outdatedPackages: function(cb) {
		var self = this;
		npm.load(function (err) {
			if (err) return cb(err);
			self.getPackages(true, function(packages) {
				npm.commands.outdated(packages, function (outdatedErr, data) {
					if (outdatedErr) return cb(outdatedErr);
					return cb(null, data);
	  			});
			});
		});
	}
}