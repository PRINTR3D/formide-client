var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: String, ref: 'users' },
	origin: { type: String },
	gcode: { type: String },
	status: { type: String },
	printjob: { type: String, rel: 'printjobs' }
});

mongoose.model('queueitems', schema);
var model = mongoose.model('queueitems');
module.exports = model;