var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true },
	user: { type: String, ref: 'users' },
	settings: { type: Schema.Types.Mixed, required: true }
});

mongoose.model('sliceprofiles', schema);
var model = mongoose.model('sliceprofiles');
module.exports = model;