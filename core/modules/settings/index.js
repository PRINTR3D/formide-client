/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
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
		return cb(FormideOS.settings.get(module));
	}
}