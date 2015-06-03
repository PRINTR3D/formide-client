var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	filename: { type: String, required: true },
	filesize: { type: Number, required: true },
	hash: { type: String, required: true }
});

mongoose.model('modelfiles', schema);
var model = mongoose.model('modelfiles');
module.exports = model;