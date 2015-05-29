var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	
});

mongoose.model('materials', schema);
var model = mongoose.model('materials');
module.exports = model;