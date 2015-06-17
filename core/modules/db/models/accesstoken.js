var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	token: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	permissions: [{ type: String }]
});
schema.plugin(timestamps);

mongoose.model('accesstokens', schema);
var model = mongoose.model('accesstokens');
module.exports = model;