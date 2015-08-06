/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var uuid = require('node-uuid');

var schema = new Schema({
	token: { type: String, required: true },
	user: { type: String, ref: 'users' },
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