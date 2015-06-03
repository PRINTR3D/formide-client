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
		return cb(FormideOS.settings);
	},
	
	getSetting: function(key, cb) {
		return cb(FormideOS.settings[key]);
	},
	
	saveSetting: function(key, value, cb) {
		FormideOS.settings[key] = value;
		return cb(FormideOS.settings[key]);
	}
}