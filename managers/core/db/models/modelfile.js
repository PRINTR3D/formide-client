var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	
});

mongoose.model('modelfiles', schema);
var model = mongoose.model('modelfiles');
module.exports = model;