var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	settings: { type: Schema.Types.Mixed, required: true }
});
schema.plugin(timestamps);

mongoose.model('sliceprofiles', schema);
var model = mongoose.model('sliceprofiles');
module.exports = model;