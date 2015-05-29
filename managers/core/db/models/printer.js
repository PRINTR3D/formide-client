var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	
});

mongoose.model('printers', schema);
var model = mongoose.model('printers');
module.exports = model;