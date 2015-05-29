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

module.exports.User = require('./user');