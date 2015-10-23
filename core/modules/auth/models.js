/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var Schema 				= FormideOS.db.mongoose.Schema;
var uuid 				= require('node-uuid');
var bcrypt 				= require('bcrypt-nodejs');
var SALT_WORK_FACTOR 	= 10;

// access tokens
var accesstokensSchema = new Schema({
	token: { type: String, required: true },
	user: { type: String, ref: 'users' },
	permissions: [{ type: String }],
	sessionOrigin: { type: String, required: true }
});

accesstokensSchema.static('generate', function(user, sessionOrigin, cb) {
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

FormideOS.db.addModel("accesstokens", "AccessToken", accesstokensSchema);

// users
var usersSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String },
	cloudConnectionToken: { type: String },
	isAdmin: { type: Boolean, default: false },
	isOwner: { type: Boolean, default: false }
});

usersSchema.pre('save', function(next) {
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

usersSchema.static('comparePassword', function(candidatePassword, realPassword, cb) {
	bcrypt.compare(candidatePassword, realPassword, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
});

usersSchema.static('getUser', function(email, password, cb) {
	usersSchema.authenticate(email, password, function(err, user) {
		if (err || !user) return cb(err);
		cb(null, user.email);
	});
});

usersSchema.static('authenticate', function(email, password, cb) {
	this.findOne({ email: email }, function(err, user) {
		if (err || !user) return cb(err);
		bcrypt.compare(password, user.password, function(err, isMatch) {
			if(err) return cb(err);
			cb(null, isMatch ? user : null)
		});
	});
});

usersSchema.set('toJSON', {
	transform: function(doc, ret, options) {
        var retJson = {
	        _id: ret._id,
            email: ret.email,
            isOwner: ret.isOwner,
            isAdmin: ret.isAdmin,
            cloudConnectionToken: ret.cloudConnectionToken
        };
        return retJson;
    }
});

FormideOS.db.addModel("users", "User", usersSchema);