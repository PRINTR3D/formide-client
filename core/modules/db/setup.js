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

	init: function(db) {
		
		var setupConfig = require('./setup.json');
		
		db.Modelfile.remove({}, function(err) {});
		db.Gcodefile.remove({}, function(err) {});
		db.Printjob.remove({}, function(err) {});
		db.Queueitem.remove({}, function(err) {});
		db.AccessToken.remove({}, function(err) {});
		
		db.User.remove({}, function(err) {
			db.User.create(setupConfig.users, function(err) {
				if (err) FormideOS.debug.log('db users create err: ' + err);
			});
		});
		
		db.Printer.remove({}, function(err) {
			db.Printer.create(setupConfig.printers, function(err) {
				if (err) FormideOS.debug.log('db printers create err: ' + err);
			});
		});
		
		db.Material.remove({}, function(err) {
			db.Material.create(setupConfig.materials, function(err) {
				if (err) FormideOS.debug.log('db materials create err: ' + err);
			});
		});
		
		db.Sliceprofile.remove({}, function(err) {
			db.Sliceprofile.create(setupConfig.sliceprofiles, function(err) {
				if (err) FormideOS.debug.log('db sliceprofiles create err: ' + err);
			});
		});
	}
}