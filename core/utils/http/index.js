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
var bcrypt					= require('bcryptjs');

var morgan = require('morgan');

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
			FormideOS.log.info('server running on port ' + this.httpServer.address().port);
		}.bind(this));

		if (this.app.get('env') !== 'production')
			this.app.use(morgan('dev'));

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

		// use response handlers
		this.app.use(function (req, res, next) {
			res.ok = require('./responses/ok').bind({ req: req, res: res });
			res.badRequest = require('./responses/badRequest').bind({ req: req, res: res });
			res.conflict = require('./responses/conflict').bind({ req: req, res: res });
			res.forbidden = require('./responses/forbidden').bind({ req: req, res: res });
			res.notFound = require('./responses/notFound').bind({ req: req, res: res });
			res.paginate = require('./responses/paginate').bind({ req: req, res: res });
			res.serverError = require('./responses/serverError').bind({ req: req, res: res });
			res.unauthorized = require('./responses/unauthorized').bind({ req: req, res: res });
			next();
		});

		// root url containing device information
		this.app.get('/', function (req, res) {
			return res.ok({
				versions:    FormideOS.config.getVersions(),
			 	environment: FormideOS.config.environment,
				mac: 		 FormideOS.config.getMacAddress()
			});
		});
	},

	setupPassport: function() {
		passport.serializeUser(function(user, done) {
			  done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
			  FormideOS.db.User.findOne({ id: id }).exec(function(err, user) {
				  if (err) return done('user not found', false);
				if (user) {
					return done(null, user);
				}
			});
		});

		passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, function(email, password, next) {

			FormideOS.log("Attempt login for " + email);

			FormideOS.db.User.findOne({ email: email}, function (err, user) {
				if (err) return next(err);
				if (!user) return next(null, false, { message: "Incorrect credentials" });

				bcrypt.compare(password, user.password, function(err, isMatch) {
					if(err) return next(err);
					next(null, isMatch ? user : null)
				});
			});
		}));
	}
}
