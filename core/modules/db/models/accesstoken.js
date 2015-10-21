/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var Schema = FormideOS.db.mongoose.Schema;
var uuid = require('node-uuid');

var schema = new Schema({
	token: { type: String, required: true },
	user: { type: String, ref: 'users' },
	permissions: [{ type: String }],
	sessionOrigin: { type: String, required: true }
});

schema.static('generate', function(user, sessionOrigin, cb) {
	var newUser = {
		token: uuid.v4(),
		user: user._id,
		sessionOrigin: sessionOrigin,
		permissions: []
	};
	
	if (user.isAdmin) {
		newUser.permissions.push('admin');
	}
	
	if (user.isOwner) {
		newUser.permissions.push('owner');
	}

	this.create(newUser, cb);
});

FormideOS.db.addModel("accesstokens", schema);