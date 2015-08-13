/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	This utility keeps track of global user settings. You can get, set and check the settings object
 *	during runtime.
 */

// Dependencies
var jsop 	= require('jsop');
var path	= require('path');

module.exports = function() {
	
	// Settings object from json file
	this.cfg = jsop(path.resolve(FormideOS.config.get('app.storageDir') + FormideOS.config.get('settings.path') + '/settings.json'));
	
	// What settings should look like (target)
	this.fullCfg = {};
	
	// Get by module settings by name or a single one in it
	this.get = function(module, setting) {
		if (setting) {
			return this.cfg[module][setting];
		}
		else {
			return this.cfg[module];
		}
	};
	
	// Set/add new value by module name, setting name
	this.set = function(module, setting, newValue) {
		if (module && setting && newValue) {
			this.cfg[module][setting] = newValue;
		}
	};
	
	// Get target settings
	this.getTarget = function() {
		return this.fullCfg;
	}
	
	// Adds target settings for a module. Input from exposeSettings function in module
	this.addModuleSettings = function(moduleName, settings) {
		this.fullCfg[moduleName] = settings;
		this.checkSettings(moduleName);
	}
	
	// Check if module settings are available, if not and required, add to settings
	this.checkSettings = function(i) {
		
		// Add module to settings if not existing
		if(this.cfg[i] === undefined || Object.keys(this.cfg[i]).length === 0) {
			this.cfg[i] = {};
		}
		
		// Add module settings for module if not existing
		var moduleSettings = this.fullCfg[i];
		for(var j in moduleSettings) {
			var moduleSetting = moduleSettings[j];
			if(this.cfg[i][moduleSetting.name] == undefined) {
				if(moduleSetting.required == true) {
					if(moduleSetting.default != undefined) {
						this.cfg[i][moduleSetting.name] = moduleSetting.default;
					}
					else {
						FormideOS.debug.log("module setting was required but no default given: " + i + " " + moduleSetting.name)
					}
				}
			}
		}
	}
	
	return this;
}