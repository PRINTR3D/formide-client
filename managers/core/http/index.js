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
session 					= expressSession({ store: sessionStore, secret: 'secret', key: 'express.sid', saveUninitialized: false, resave: false });

var expressValidator 		= require('express-validator')
var cors 					= require('cors');
var passport 				= require('passport');
var LocalStrategy 			= require('passport-local').Strategy;
var BearerStrategy 			= require('passport-http-bearer').Strategy;
var bodyParser 				= require('body-parser');
var permissionsMiddleware	= require('./middleware/permissions');

module.exports =
{
	server: {},

	init: function()
	{
		var http = {};

		http.app = express();
		http.server = require('http').Server( http.app );
		http.server.listen( FormideOS.config.get('app.port'), function()
		{
			FormideOS.manager('debug').log('http server running on port ' + http.server.address().port );
		});

		http.app.use( bodyParser.json() );
		http.app.use( bodyParser.urlencoded({extended: true}) );
		http.app.use( expressValidator() );

		http.app.use( cookieParser() );
		http.app.use( session );

		http.app.use( passport.initialize() );
		http.app.use( passport.session() );

		http.app.use(cors({
			origin: true,
			credentials: true
		}));

		http.app.use( permissionsMiddleware.initialize() );

		passport.serializeUser(function(user, done)
		{
		  	done(null, user.id);
		});

		passport.deserializeUser(function(id, done)
		{
		  	FormideOS.manager('core.db').db.User
			.find({ where: {id: id } })
			.then(function( user )
			{
				if( user )
				{
					done(null, user);
				}
			});
		});

		passport.use( 'local-signup', new LocalStrategy(function( username, password, callback )
		{
			process.nextTick( function()
			{
				FormideOS.manager('core.db').db.user
				.find({ where: {username: username} })
				.then(function( user )
				{
					if( user )
					{
						return callback( null, false, { message: 'Username already taken' } );
					}

					FormideOS.manager('core.db').db.User
					.create({
						username: username,
						password: password
					})
					.success(function( user )
					{
						return callback( null, user);
					});
				});
			});
		}));

		passport.use( 'local-login', new LocalStrategy(function( username, password, callback )
		{
			FormideOS.manager('debug').log( 'Login attempt for ' + username );

			FormideOS.manager('core.db').db.User
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

		passport.use( 'bearer-login', new BearerStrategy({}, function( token, callback )
		{
			FormideOS.manager('debug').log( 'Token login attempt for ' + token );

			FormideOS.manager('core.db').db.Accesstoken
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

		this.server = http;
		this.server.auth = passport;
		this.server.permissions = permissionsMiddleware;
	}
}