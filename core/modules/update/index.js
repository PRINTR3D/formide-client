/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
var fs 			= require('fs');
var npm 		= require('npm');
var path		= require('path');
var gitty		= require('gitty');

module.exports = {
	
	exposeSettings: function() {
		return [
			{
				name: "modules",
				type: "hidden",
				required: true,
				default: ['formideos-interface'] // install the interface module by default, important!
			}
		];
	},
	
	// for now updates 3rd party modules as well!
	updateOS: function(cb) {
		var formideosRepo = gitty(FormideOS.appRoot);
		formideosRepo.pull('origin', 'master', function(err) {
			if (err) return res.send(err);
			npm.load(function (err) {
				npm.commands.update(function (updateErr, data) {
					if (updateErr) return cb(err);
					return cb(null, {
						"core": "updated",
						"dependencies": data
		    		});
	  			});
  			});
		});
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
			npm.commands.update([packageName], function (updateErr, data) {
				if (updateErr) return cb(err);
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
				npm.commands.install([packageName], function (installErr, data) {
					if (installErr) return cb(err);
					modules.push(packageName);
					FormideOS.settings.set('update', 'modules', modules);
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
				if (uninstallErr) return cb(err);
				var modules = FormideOS.settings.get('update', 'modules');
				var index = modules.indexOf(packageName);
				modules.splice(index, 1);
				FormideOS.settings.set('update', 'modules', modules);
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
					if (outdatedErr) return cb(err);
					return cb(null, data);
	  			});
			});
		});
	}
}