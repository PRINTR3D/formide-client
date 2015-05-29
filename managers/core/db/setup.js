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

module.exports = {

	init: function(db) {
		
		db.User.create({
			password: "derp",
			email: "derp@printr.nl",
			firstname: "Chris",
			lastname: "ter Beke"
		}, function(err, user) {
			console.log(err);
			console.log(user);
		});
		
	}
}