/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */


var db 			= require('../core/modules/db/models');	
var setupConfig = require('./setup.json');

db.Modelfile.remove({}, function(err) {});
db.Gcodefile.remove({}, function(err) {});
db.Printjob.remove({}, function(err) {});
db.Queueitem.remove({}, function(err) {});
db.AccessToken.remove({}, function(err) {});

db.User.remove({}, function(err) {
	db.User.create(setupConfig.users, function(err) {
		if (err) console.log('db users create err: ' + err);
	});
});

db.Printer.remove({}, function(err) {
	db.Printer.create(setupConfig.printers, function(err) {
		if (err) console.log('db printers create err: ' + err);
	});
});

db.Material.remove({}, function(err) {
	db.Material.create(setupConfig.materials, function(err) {
		if (err) console.log('db materials create err: ' + err);
	});
});

db.Sliceprofile.remove({}, function(err) {
	db.Sliceprofile.create(setupConfig.sliceprofiles, function(err) {
		if (err) console.log('db sliceprofiles create err: ' + err);
	});
});