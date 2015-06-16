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

var fs = require('fs');
var observed = require('observed');

module.exports = function(FormideOS) {

	// environment
	this.env = process.env.NODE_ENV || 'development';
	
	// settings object
	this.cfg = JSON.parse(fs.readFileSync(FormideOS.appRoot + FormideOS.config.get('settings.path') + '/settings.json', {encoding: 'utf8'}));
	
	// settings target object
	this.fullCfg = {};

	// watch settings object
	var ee = observed(this.cfg);

	// write settings to storage when changed
	ee.on('change', function() {
		fs.writeFileSync(FormideOS.appRoot + FormideOS.config.get('settings.path') + '/settings.json', JSON.stringify(cfg));
	});
	
	// get all settings (for a module)
	this.getSettings = function(module) {
		if (module) return this.cfg[module];
		return this.cfg;
	}
	
	// set settings of a module
	this.getSetting = function(module, key) {
		return this.cfg[module][key];
	}
	
	// save settings of a module
	this.saveSetting = function(module, key, value) {
		this.cfg[module][key] = value;
		return this;
	}
	
	// adds settings for a module
	this.addModuleSettings = function(moduleName, moduleSettings) {
		this.fullCfg[moduleName] = moduleSettings;
	}
	
	// loop over all settings to see if required ones are there
	this.checkSettings = function() {
		for(var i in this.fullCfg) {
			var moduleSettings = this.fullCfg[i];
			if(this.cfg[i] === undefined || Object.keys(this.cfg[i]).length === 0) {
				this.cfg[i] = {};
				for(var j in moduleSettings) {
					if(moduleSettings[j].required === true && moduleSettings[j].default !== undefined) {
						this.cfg[i][j] = moduleSettings[j].default;
					}
					else {
						FormideOS.manager('debug').log("module setting was required but no default given: " + i + " " + j)
					}
				}
			}
		}
	}
	
	return this;
}