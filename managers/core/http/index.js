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
express 			= require('express');
var passport 		= require('passport');
var LocalStrategy 	= require('passport-local').Strategy;
var BearerStrategy 	= require('passport-http-bearer').Strategy;
var bodyParser 		= require('body-parser');
var session 		= require('express-session');
var MemoryStore 	= session.MemoryStore;
var uuid 			= require('node-uuid');

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
		http.app.use( session({
		    key: 'KEY',
		    secret: 'SECRET331156%^!fafsdaasd',
		    store: new MemoryStore({reapInterval: 60000 * 10}),
		    saveUninitialized: true,
		    resave: false
		}) );
		http.app.use( passport.initialize() );
		http.app.use( passport.session() );

/*
		http.app.all('/*', function( req, res, next )
		{
			res.header( "Access-Control-Allow-Origin", req.headers.origin );
			res.header( "Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "DNT", "Accept-Encoding" );
			res.header( "Access-Control-Allow-Credentials", true );
			next();
		});
*/

		http.app.use(function(req, res, next) {
		    var oneof = false;
		    if(req.headers.origin) {
		        res.header('Access-Control-Allow-Origin', req.headers.origin);
		        oneof = true;
		    }
		    if(req.headers['access-control-request-method']) {
		        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
		        oneof = true;
		    }
		    if(req.headers['access-control-request-headers']) {
		        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
		        oneof = true;
		    }
		    if(req.headers['access-control-allow-credentials']) {
			    res.header('Access-Control-Allow-Credentials', req.headers['access-control-allow-credentials']);
			    oneof = true;
		    }
		    if(oneof) {
		        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
		    }

		    // intercept OPTIONS method
		    if (oneof && req.method == 'OPTIONS') {
		        res.send(200);
		    }
		    else {
		        next();
		    }
		});

		passport.accessTokens = [];
		passport.generateAccessToken = function( callback )
		{
			var token = uuid.v4();

		  	passport.accessTokens.push( token );

		  	return callback( token );
		};

		passport.removeAccessToken = function( token )
		{
			var index = array.indexOf(token);
			passport.accessTokens.splice(index, 1);
		};

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

		passport.use( new LocalStrategy(function( username, password, callback )
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

		passport.use( new BearerStrategy({}, function( token, callback )
		{
			if(passport.accessTokens.indexOf( token ) > -1)
			{
				return callback(null, true);
			}
			return callback(null, false);
		}));

		this.server = http;
		this.server.auth = passport;
	}
}