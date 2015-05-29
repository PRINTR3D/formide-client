var models = require('./models');

module.exports = {
	
	db: models,
	
	init: function() {
		
		this.db.User.find().exec(function(err, users) {
			console.log(users);
		});
		
/*
		this.db.User.create({
			password: "derp",
			email: "derp@printr.nl",
			firstname: "Chris",
			lastname: "ter Beke"
		}, function(err, user) {
			console.log(err);
			console.log(user);
		});
*/
	}
}