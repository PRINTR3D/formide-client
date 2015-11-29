/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var uuid = require('node-uuid');

module.exports = function(Waterline) {

	var AccessToken = Waterline.Collection.extend({

		identity: 'accesstoken',

		connection: 'default',

		attributes: {

			// authorized user
			createdBy: {
				model: 'user'
			},

			// the actual access token
			token: {
				type: 'string'
			},

			permissions: {
				type: 'array',
				defaultsTo: []
			},

			sessionOrigin: {
				type: 'string',
				required: true,
				enum: ["local", "cloud"]
			}
		},

		// hash password before saving user to database
		beforeCreate: function (accessToken, next) {
			accessToken.token = uuid.v4();
			next();
		}
	});

	return AccessToken;
}
