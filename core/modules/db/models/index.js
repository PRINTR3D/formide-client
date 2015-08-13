/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var tungus = require('tungus');
var mongoose = require('mongoose');
var storage = SETUP.dbLocation || FormideOS.appRoot + FormideOS.config.get('db.storage');
global.TUNGUS_DB_OPTIONS =  { nativeObjectID: true, searchInArray: true };

// connect to tingodb client
try {
    mongoose.connect('tingodb://' + storage);
}
catch(e) {
    console.log(e);
}

// export all mongoose objects
module.exports.mongoose = mongoose;
module.exports.AccessToken = require('./accesstoken');
module.exports.Material = require('./material');
module.exports.Modelfile = require('./modelfile');
module.exports.Gcodefile = require('./gcodefile');
module.exports.Printer = require('./printer');
module.exports.Printjob = require('./printjob');
module.exports.Queueitem = require('./queueitem');
module.exports.Sliceprofile = require('./sliceprofile');
module.exports.User = require('./user');