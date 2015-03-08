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

var passport 		= require('passport');
var LocalStrategy 	= require('passport-local').Strategy;
var bodyParser 		= require('body-parser');
var session 		= require('express-session');
var MemoryStore 	= session.MemoryStore;

FormideOS.http.app.use( bodyParser.json() );
FormideOS.http.app.use( bodyParser.urlencoded({extended: true}) );
FormideOS.http.app.use( session({
    key: 'KEY',
    secret: 'SECRET331156%^!fafsdaasd',
    store: new MemoryStore({reapInterval: 60000 * 10}),
    saveUninitialized: true,
    resave: false
}) );
FormideOS.http.app.use( passport.initialize() );
FormideOS.http.app.use( passport.session() );

passport.serializeUser(function(user, done)
{
  	done(null, user.id);
});

passport.deserializeUser(function(id, done)
{
  	FormideOS.db.User
	.find({ where: {id: id } })
	.then(function( user )
	{
		if( user )
		{
			done(null, user);
		}
	});
});

passport.use( new LocalStrategy(function( username, password, callback )
{
	FormideOS.debug( 'Login attempt for ' + username );

	FormideOS.db.User
	.find({ where: {username: username } })
	.then(function( user )
	{
		if( !user )
		{
			return callback(null, false, { message: 'Incorrect username.' });
		}

		if( user.password != password )
		{
			return callback(null, false, { message: 'Incorrect password.' });
		}

		return callback(null, user);
	});
}));

module.exports = passport;