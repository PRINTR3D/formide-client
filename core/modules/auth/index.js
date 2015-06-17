/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
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