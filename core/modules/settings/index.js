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
		return FormideOS.settings.getTarget();
	},
	
	getSetting: function(module, key, cb) {
		return cb(FormideOS.settings.get(module, key));
	},
	
	getModuleSettings: function(module, cb) {
		return cb(FormideOS.settings.get(module));
	},
	
	saveModuleSettings: function(module, keyValuePairs, cb) {
		// we do this for loop instead of replacing the whole object to prevent losing keys that are not posted
		for(var i in keyValuePairs) {
			FormideOS.settings.set(module, i, keyValuePairs[i]);
		}
		return cb(FormideOS.settings.getSettings(module));
	}
}