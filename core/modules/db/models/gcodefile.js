var mongoose = require('mongoose')
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	filename: { type: String, required: true },
	filesize: { type: Number, required: true },
	hash: { type: String, required: true }
});
schema.plugin(timestamps);

mongoose.model('gcodes', schema);
var model = mongoose.model('gcodes');
module.exports = model;