/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var Waterline 			= require('waterline');
var sailsDiskAdapter 	= require('sails-disk');
var waterline 			= new Waterline();
var db					= null;

var config = {
    adapters: {
        'disk': sailsDiskAdapter
    },

    connections: {
        default: {
            adapter: 'disk'
        }
    }
};

var userCollection = require('./models/User')(Waterline);
waterline.loadCollection(userCollection);

var accessTokenCollection = require('./models/AccessToken')(Waterline);
waterline.loadCollection(accessTokenCollection);

var logCollection = require('./models/Log')(Waterline);
waterline.loadCollection(logCollection);

var userFileColleciton = require('./models/UserFile')(Waterline);
waterline.loadCollection(userFileColleciton);

var materialCollection = require('./models/Material')(Waterline);
waterline.loadCollection(materialCollection);

var printerCollection = require('./models/Printer')(Waterline);
waterline.loadCollection(printerCollection);

var sliceprofileCollection = require('./models/Sliceprofile')(Waterline);
waterline.loadCollection(sliceprofileCollection);

var printjobCollection = require('./models/Printjob')(Waterline);
waterline.loadCollection(printjobCollection);

var queueItemCollection = require('./models/Queueitem')(Waterline);
waterline.loadCollection(queueItemCollection);

module.exports = function(callback) {
	
	waterline.initialize(config, function (err, ontology) {
		if (err) {
			return callback(err);
		}
	
		callback(null, {
			User: ontology.collections.user,
			AccessToken: ontology.collections.accesstoken,
			Log: ontology.collections.log,
			UserFile: ontology.collections.userfile,
			Material: ontology.collections.material,
			Printer: ontology.collections.printer,
			Sliceprofile: ontology.collections.sliceprofile,
			Printjob: ontology.collections.printjob,
			QueueItem: ontology.collections.queueitem
		});
	});
}



/*
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
    FormideOS.log.error(e.message);
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
*/