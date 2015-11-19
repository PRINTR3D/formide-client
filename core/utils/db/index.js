/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var Waterline 			= require('waterline');
var sailsDiskAdapter 	= require('sails-disk'); // yes, we know the respository says it's not for production, but it fits our needs perfectly :P
var waterline 			= new Waterline();
var db					= null;
var path				= require('path');

if (typeof SETUP !== "undefined") {
	var storage = path.join(SETUP.storageDir, "database_");
}
else {
	var storage = path.join(FormideOS.config.get('app.storageDir'), "database_");
}

var config = {
    adapters: {
        disk: sailsDiskAdapter
    },
    connections: {
        default: {
            adapter: 'disk',
            filePath: storage
        }
    },
	defaults: {
		migrate: 'safe'
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
