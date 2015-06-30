/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var mongoose 			= require('mongoose');
var timestamps  		= require('mongoose-timestamp');
var Schema 				= mongoose.Schema;
var bcrypt 				= require('bcrypt-nodejs');
var SALT_WORK_FACTOR 	= 10;
 
var schema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String },
	permissions: [{ type: String }],
	cloudConnectionToken: { type: String }
});
schema.plugin(timestamps);

schema.pre('save', function(next) {
	var user = this;
	
	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

schema.static('comparePassword', function(candidatePassword, realPassword, cb) {
	bcrypt.compare(candidatePassword, realPassword, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
});

schema.static('getUser', function(email, password, cb) {
	OAuthUsersModel.authenticate(email, password, function(err, user) {
		if (err || !user) return cb(err);
		cb(null, user.email);
	});
});

schema.static('authenticate', function(email, password, cb) {
	this.findOne({ email: email }, function(err, user) {
		if (err || !user) return cb(err);
		OAuthUsersModel.comparePassword(password, user.password, function(err, match) {
			cb(null, match ? user : null)
		});
	});
});

schema.set('toJSON', {
	transform: function(doc, ret, options) {
        var retJson = {
	        _id: ret._id,
            email: ret.email,
            permissions: ret.permissions,
            cloudConnectionToken: ret.cloudConnectionToken
        };
        return retJson;
    }
});

mongoose.model('users', schema);
var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;