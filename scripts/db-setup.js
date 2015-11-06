/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var async = require('async');

require('../core/utils/db')(function (err, db) {
	if (err) {
		FormideOS.log.err(err);
		process.exit(1);
	}
	
	db.User.create({
		email: "admin@local",
		password: "admin",
		isAdmin: true
	}, function (err, users) {
		if (err) console.log(err);
	});
	
/*
	async.series([
		function (callback) {
		    db.User.drop(function (err) {
			    if (err) return callback(err);
				db.User.create({
					email: "admin@local",
					password: "admin",
					isAdmin: true
				}, function (err, users) {
					if (err) return callback(err);
					callback(null, users);
				});
			});
	    },
	    function (callback) {
		    db.UserFile.drop(callback);
	    },
		function (callback) {
		    db.Printjob.drop(callback);
	    },
	    function (callback) {
		    db.QueueItem.drop(callback);
	    },
	    function (callback) {
		    db.AccessToken.drop(callback);
	    },
	    function (callback) {
		    db.Printer.drop(callback);
	    },
	    function (callback) {
		    db.Material.drop(callback);
	    },
	    function (callback) {
		    db.Sliceprofile.drop(callback);
	    }
	], function (err) {
		if (err) console.log(err);
		console.log("Done clearing and seeding database");
	});
*/
});