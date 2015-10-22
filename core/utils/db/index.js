/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var tungus = require('tungus');
var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

if (typeof SETUP !== "undefined") {
	var storage = SETUP.storageDir + "/database";
}
else {
	var storage = FormideOS.config.get('app.storageDir') + FormideOS.config.get('db.storage');
}

global.TUNGUS_DB_OPTIONS =  { nativeObjectID: true, searchInArray: true };

// connect to tingodb client
try {
    mongoose.connect('tingodb://' + storage);
}
catch(e) {
    console.log(e);
}

module.exports = {
	
	db: {},
	
	addModel: function(collectionName, modelName, schema) {
		// define model based on schema
		mongoose.model(collectionName, schema);
		// put model in db
		this[modelName] = mongoose.model(collectionName);
	},
	
	mongoose: mongoose
}