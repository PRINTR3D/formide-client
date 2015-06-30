/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var uuid = require('node-uuid');

module.exports =
{	
	generateAccessToken: function(permissions, callback) {
		var token = uuid.v4();
		
		permissions = JSON.parse(permissions);
		
		FormideOS.module('db').db.AccessToken.create({
			token: token,
			permissions: permissions
		}, function(err, accesstoken) {
			return callback({
			  	success: true,
			  	token: accesstoken
			});
		});
	},

	getAccessTokens: function(callback) {
		FormideOS.module('db').db.AccessToken.find().exec( function(err, tokens) {
			return callback(tokens);
		});
	},

	deleteAccessToken: function( token, callback ) {
		FormideOS.module('db').db.AccessToken.remove({ token: token }, function(err) {
			if (err) return callback(err);
			return callback();
		});
	}
}