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
	
	getSetting: function(key, cb) {
		if (cb) return cb(FormideOS.settings.getSetting(key));
		return FormideOS.settings.getSetting(key);
	},
	
	getBootstrapInfo: function(cb) {
		return cb(FormideOS.modules); // only for settings api
	},
	
	saveSetting: function(key, value, cb) {
		FormideOS.settings.saveSetting(key, value);
		if (cb) return cb(FormideOS.settings.getSetting(key));
		return FormideOS.settings.getSetting(key);
	}
}