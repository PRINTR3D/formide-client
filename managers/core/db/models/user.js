var mongoose = require('mongoose')
var Schema = mongoose.Schema;
 
var OAuthUsersSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	avatar: String,
	//scopes: [{ type: String, ref: 'scopes' }],
	//confirmationToken: String
});
/*
OAuthUsersSchema.plugin(timestamps);
OAuthUsersSchema.plugin(soft_delete);
*/


OAuthUsersSchema.set('toJSON', {
	transform: function(doc, ret, options) {
        var retJson = {
	        _id: ret._id,
            email: ret.email,
            firstname: ret.firstname,
            lastname: ret.lastname,
            //avatar: ret.avatar
        };
        return retJson;
    }
});

mongoose.model('users', OAuthUsersSchema);
var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;