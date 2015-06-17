var tungus = require('tungus');
var mongoose = require('mongoose');
var storage = FormideOS.appRoot + FormideOS.config.get('database.storage');
global.TUNGUS_DB_OPTIONS =  { nativeObjectID: true, searchInArray: true };

try {
    mongoose.connect('tingodb://' + storage);
}
catch(e) {
    console.log(e);
}

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