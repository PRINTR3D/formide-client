var mongoose 			= require('mongoose')
var Schema 				= mongoose.Schema;
var bcrypt 				= require('bcrypt');
var crypto 				= require('crypto');
var SALT_WORK_FACTOR 	= 10;
 
var OAuthUsersSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	permissions: [{ type: String }],
	cloud: { type: Boolean, default: false }
});

/*
OAuthUsersSchema.plugin(timestamps);
OAuthUsersSchema.plugin(soft_delete);
*/

OAuthUsersSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

OAuthUsersSchema.static('comparePassword', function(candidatePassword, realPassword, cb) {
	bcrypt.compare(candidatePassword, realPassword, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
});

OAuthUsersSchema.static('getUser', function(email, password, cb) {
	OAuthUsersModel.authenticate(email, password, function(err, user) {
		if (err || !user) return cb(err);
		cb(null, user.email);
	});
});

OAuthUsersSchema.static('authenticate', function(email, password, cb) {
	this.findOne({ email: email }, function(err, user) {
		if (err || !user) return cb(err);
		OAuthUsersModel.comparePassword(password, user.password, function(err, match) {
			cb(null, match ? user : null)
		});
	});
});

OAuthUsersSchema.set('toJSON', {
	transform: function(doc, ret, options) {
        var retJson = {
	        _id: ret._id,
            email: ret.email,
            permissions: ret.permissions
        };
        return retJson;
    }
});

mongoose.model('users', OAuthUsersSchema);
var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;