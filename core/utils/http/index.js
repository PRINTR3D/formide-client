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

// dependencies
express 					= require('express');
var expressSession			= require('express-session');
cookieParser 				= require('cookie-parser');
var MemoryStore 			= expressSession.MemoryStore;
sessionStore 				= new MemoryStore();
sessionMiddleware			= expressSession({ store: sessionStore, secret: 'secret', key: 'formide.sid', saveUninitialized: false, resave: false });
var expressValidator 		= require('express-validator');
var cors 					= require('cors');
var passport 				= require('passport');
var LocalStrategy 			= require('passport-local').Strategy;
var BearerStrategy 			= require('passport-http-bearer').Strategy;
var bodyParser 				= require('body-parser');
var permissionsMiddleware	= require('./middleware/permissions');
var passwordHash 			= require('password-hash');
var bearerToken 			= require('express-bearer-token');
var server					= {};
var http 					= {};

http.app = express();
http.server = require('http').Server( http.app );
http.server.listen( FormideOS.config.get('app.port'), function() {
	FormideOS.debug.log('server running on port ' + http.server.address().port);
});

http.app.use( bodyParser.json() );
http.app.use( bodyParser.urlencoded({extended: true}) );
http.app.use( expressValidator() );

http.app.use( cookieParser() );
http.app.use( sessionMiddleware );

http.app.use( passport.initialize() );
http.app.use( passport.session() );

http.app.use(bearerToken());

http.app.use(cors({
	origin: true,
	credentials: true
}));

passport.serializeUser(function(user, done) {
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  	FormideOS.module('db').db.User.findOne({ _id: id }).exec(function(err, user) {
	  	if (err) return done('user not found', false);
		if (user) {
			return done(null, user);
		}
	});
});

passport.use( 'local-signup', new LocalStrategy(function(email, password, callback) {
	process.nextTick( function() {
/*
		FormideOS.module('db').db.user
		.find({ where: {username: username} })
		.then(function( user ) {
			if( user )
			{
				return callback( null, false, { message: 'Username already taken' } );
			}

			var hashedPassword = passwordHash.generate(password);

			FormideOS.module('db').db.User
			.create({
				username: username,
				password: hashedPassword
			})
			.success(function( user )
			{
				return callback( null, user);
			});
		});
*/
	});
}));

passport.use('local-login', new LocalStrategy({usernameField: 'email'}, function(email, password, next) {
	FormideOS.debug.log('Login attempt for ' + email);
	FormideOS.module('db').db.User.authenticate(email, password, function(err, user) {
		if (err) return next(err);
		if (!user || user === 'undefined') {
			return next(null, false, { message: 'Incorrect user credentials' });
		}
		return next(null, user);
	});
}));

http.app.use( permissionsMiddleware.initialize() );

/*
passport.use( 'bearer-login', new BearerStrategy({}, function( token, callback )
{
	FormideOS.debug.log( 'Token login attempt for ' + token );

	FormideOS.module('db').db.Accesstoken
	.fin({ where: {token: token } })
	.then(function( token )
	{
		if( !token )
		{
			return callback(null, false, { message: 'Incorrect token.' });
		}

		return callback(null, token);
	});
}));
*/

FormideOS.events.on('moduleManage.dispose', function(moduleInfo) {
	console.log(moduleInfo);
});

server = http;
server.session = sessionMiddleware;
server.auth = passport;
server.permissions = permissionsMiddleware;

module.exports = server;