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

var fs 			= require('fs');
var gitpull 	= require('git-pull');
var npm 		= require("npm");

module.exports = {
	
	exposeSettings: function() {
		return [
			{
				name: "modules",
				type: "hidden",
				required: true,
				default: []
			}
		];
	},
	
	// for now updates 3rd party modules as well!
	updateOS: function(cb) {
		gitpull(FormideOS.appRoot, function(err, consoleOutput) {
		    if (err) {
			    return cb(err, consoleOutput);
		    }
		    else {
			    npm.load(function (err) {
					if (err) return cb(err);
					npm.commands.update(function (updateErr, data) {
						if (updateErr) return cb(err);
						return cb(null, data);
						return cb(null, {
							"core": consoleOutput,
							"dependencies": data
			    		});
		  			});
				});
		    }
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
		var modules = FormideOS.module('settings').getSetting('update', 'modules');
		if(modules.indexOf(packageName) > -1) {
			return cb(true, "package already installed");
		}
		else {
			npm.load({ save: true }, function (err) {
				if (err) return cb(err);
				npm.commands.install([packageName], function (installErr, data) {
					if (installErr) return cb(err);
					modules.push(packageName);
					FormideOS.module('settings').saveSetting('update', 'modules', modules);
					if (data !== undefined) {
						FormideOS.moduleManager.loadModule(packageName);
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
				var modules = FormideOS.module('settings').getSetting('update', 'modules');
				var index = modules.indexOf(packageName);
				modules.splice(index, 1);
				FormideOS.module('settings').saveSetting('update', 'modules', modules);
				FormideOS.deregister(packageName);
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