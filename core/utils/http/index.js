/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	HTTP server for FormideOS. All modules can add a sub-app to this express webserver. Permissions
 *	are added automatically by module namespace. We use passport for authentication with local login.
 */

// dependencies
var express 				= require('express');
var expressSession			= require('express-session');
cookieParser 				= require('cookie-parser');
var MemoryStore 			= expressSession.MemoryStore;
sessionStore 				= new MemoryStore();
sessionMiddleware			= expressSession({ store: sessionStore, secret: 'secret', key: 'formide.sid', saveUninitialized: false, resave: false });
var expressValidator 		= require('express-validator');
var cors 					= require('cors');
var passport 				= require('passport');
var LocalStrategy 			= require('passport-local').Strategy;
var bodyParser 				= require('body-parser');
//var permissionsMiddleware	= require('./middleware/permissions');
var isUserMiddleware		= require('./middleware/isUser');
var isAdminMiddleware		= require('./middleware/isAdmin');
var passwordHash 			= require('password-hash');
var bearerToken 			= require('express-bearer-token');

module.exports = {
	
	app: null,
	httpServer: null,
	passport: null,
	
	init: function() {
		this.setupApp();
		this.setupPassport();
		
		return {
			express: express,
			app: this.app,
			server: this.httpServer,
			session: sessionMiddleware,
			auth: passport,
			permissions: {
				isUser: isUserMiddleware,
				isAdmin: isAdminMiddleware
			}
		}
	},
	
	setupApp: function() {
		
		// setup express app
		this.app = express();
		
		// setup http server on app
		this.httpServer = require('http').Server(this.app);
		
		// listen to port stated in app.port config (usually port 1337)
		this.httpServer.listen(FormideOS.config.get('app.port'), function() {
			FormideOS.log('server running on port ' + this.httpServer.address().port);
		}.bind(this));
		
		// use json body parser for json post requests
		this.app.use(bodyParser.json());
		
		// use json body parser for url encoded post requets
		this.app.use(bodyParser.urlencoded({ extended: true }));
		
		// use cookie parser middleware
		this.app.use(cookieParser());
		
		// use session middleware
		this.app.use(sessionMiddleware);
		
		// use passport middleware
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		
		// use bearer token middleware
		this.app.use(bearerToken({
			queryKey: 'access_token'
		}));
		
		// use cors middleware
		this.app.use(cors({
			origin: true,
			credentials: true
		}));
	},
	
	setupPassport: function() {
		passport.serializeUser(function(user, done) {
		  	done(null, user._id);
		});
		
		passport.deserializeUser(function(id, done) {
		  	FormideOS.db.User.findOne({ _id: id }).exec(function(err, user) {
			  	if (err) return done('user not found', false);
				if (user) {
					return done(null, user);
				}
			});
		});
		
		passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, function(email, password, next) {
			FormideOS.log('Login attempt for ' + email);
			FormideOS.db.User.authenticate(email, password, function(err, user) {
				if (err) return next(err);
				if (!user || user === 'undefined') {
					return next(null, false, { message: 'Incorrect user credentials' });
				}
				return next(null, user);
			});
		}));
	}
}