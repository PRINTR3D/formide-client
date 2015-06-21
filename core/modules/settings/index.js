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

module.exports = {
	
	getSettings: function(cb) {
		if (cb) return cb(FormideOS.settings.getSettings());
		return FormideOS.settings.getSettings();
	},
	
	getExposedSettings: function(cb) {
		exposedSettings = {};
		for(var i in FormideOS.moduleManager.getModules()) {
			var moduleInfo = FormideOS.moduleManager.getModuleInfo(i);
			if(moduleInfo.exposeSettings !== false) {
				exposedSettings[i] = moduleInfo.exposeSettings;
			}
		}
		return cb(exposedSettings);
	},
	
	getSetting: function(module, key, cb) {
		if (cb) return cb(FormideOS.settings.getSetting(module, key));
		return FormideOS.settings.getSetting(module, key);
	},
	
	getModuleSettings: function(module, cb) {
		if (cb) return cb(FormideOS.settings.getSettings(module));
		return FormideOS.settings.getSettings(module);
	},
	
	saveModuleSettings: function(module, keyValuePairs, cb) {
		// we do this for loop instead of replacing the whole object to prevent losing keys that are not posted
		for(var i in keyValuePairs) {
			FormideOS.settings.saveSetting(module, i, keyValuePairs[i]);
		}
		if (cb) return cb(FormideOS.settings.getSettings(module));
		return FormideOS.settings.getSettings(module);
	},
	
	saveSetting: function(module, key, value, cb) {
		FormideOS.settings.saveSetting(module, key, value);
		if (cb) return cb(FormideOS.settings.getSetting(module, key));
		return FormideOS.settings.getSetting(module, key);
	}
}