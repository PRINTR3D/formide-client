var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	
});

mongoose.model('queueitems', schema);
var model = mongoose.model('queueitems');
module.exports = model;