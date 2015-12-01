/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var bcrypt = require('bcrypt');

module.exports = function(Waterline) {

	var User = Waterline.Collection.extend({

		identity: 'user',

		connection: 'default',

		attributes: {

			email: {
				type: 'string',
				required: true,
				unique: true
			},

			password: {
				type: 'string',
				protected: true
			},

			cloudConnectionToken: {
				type: 'string'
			},

			isAdmin: {
				type: 'boolean',
				defaultsTo: false
			},

			isOwner: {
				type: 'boolean',
				defaultsTo: false
			}
		},

		// hash password before saving user to database
		beforeCreate: function (user, next) {
			if (user.password) {
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(user.password, salt, function(err, hash) {
						if (err) next(err);
						user.password = hash;
						next();
					})
				})
			}
			else {
				next();
			}
		},

		// hash password before saving to database
		beforeUpdate: function (user, next) {
			if (user.password) {
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(user.password, salt, function(err, hash) {
						if (err) next(err);
						user.password = hash;
						next();
					})
				})
			}
			else {
				next();
			}
		}
	});

	return User;
}
