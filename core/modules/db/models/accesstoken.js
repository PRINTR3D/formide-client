var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var uuid = require('node-uuid');

var schema = new Schema({
	token: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	permissions: [{ type: String }],
	sessionOrigin: { type: String, required: true }
});
schema.plugin(timestamps);

schema.static('generate', function(user, sessionOrigin, cb) {
	this.create({
		token: uuid.v4(),
		user: user._id,
		permissions: user.permissions,
		sessionOrigin: sessionOrigin
	}, cb);
});

mongoose.model('accesstokens', schema);
var model = mongoose.model('accesstokens');
module.exports = model;