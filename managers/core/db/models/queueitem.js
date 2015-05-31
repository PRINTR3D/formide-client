var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: String, ref: 'users' },
	origin: { type: String, required: true },
	gcode: { type: String, required: true },
	status: { type: String, required: true },
	printjob: { type: String, rel: 'printjobs', required: true }
});

mongoose.model('queueitems', schema);
var model = mongoose.model('queueitems');
module.exports = model;