var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	
});

mongoose.model('accesstokens', schema);
var model = mongoose.model('accesstokens');
module.exports = model;