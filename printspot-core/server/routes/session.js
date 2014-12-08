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

var passport 			= require('passport');
var LocalStrategy 		= require('passport-local').Strategy;
var crypto				= require('crypto');

passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
},
function(username, password, done) {
	global.db.User.find({where: {username: username}})
		.success(function(user) {
			if(!user) {
				return done(null, false, {message: 'User does not exist'});
			}
			else if(password != user.password) {
				return done(null, false, {message: 'Wrong password'});
			}
			else {
				return done(null, user);
			}
		})
		.error(function(err) {
			return done(err);
		});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	global.db.User.find(id)
		.success(function(user) {
			done(null, user);
		})
		.error(function(err) {
			done(new Error('User ' + id + ' does not exist'));
		});
});

module.exports = exports = function(app)
{
	app.set('jwtTokenSecret', 'SECRETSTRING');
	app.use(passport.initialize());
	app.use(passport.session());

	app.post('/login', function(req, res, next)
	{
		passport.authenticate('local', function(err, user, info) {
			if(err) {
				return res.send(401);
			}

			if(!user) {
				return res.send(401);
			}

			req.logIn(user, function(err) {
				return res.send(401);
			});

			var token = crypto.randomBytes(64).toString('hex');

			return res.json({
				token : token,
				user: user.toJSON()
			});
		})(req, res, next);
	});

	app.get('/session', function(req, res)
	{
		return res.json(req.isAuthenticated());
	});

	app.get('/settings', function(req, res)
	{
		// return settings of logged in user
	});

	app.post('/settings', function(req, res)
	{
		// write settings of logged in user
	});

	app.post('/logout', function(req, res)
	{
		if(req.isAuthenticated()) {
			req.logout();
			return res.json('OK');
		}
	});

	global.log('info', 'Module loaded: routes/session.js', {});
};