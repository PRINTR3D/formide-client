var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	token: { type: String, required: true },
	user: { type: String, ref: 'users' },
	permissions: [{ type: String }]
});

mongoose.model('accesstokens', schema);
var model = mongoose.model('accesstokens');
module.exports = model;