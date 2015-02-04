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

module.exports =
{
	init: function()
	{
		Printspot.http.server.register(require('hapi-auth-cookie'), function (err)
		{
		    Printspot.http.server.auth.strategy('session', 'cookie',
		    {
		        password: 'secret',
		        cookie: 'cookie',
		        redirectTo: '/login',
		        isSecure: false
		    });
		});


		/*
Printspot.http.server.auth.strategy('passport', 'passport');

		passport.serializeUser(function(user, done)
		{
			done(null, user.id);
		});

		passport.deserializeUser(function(id, done)
		{
		  	Printspot.db.User.find({where: {id: id}})
		  	.success(function(user)
		  	{
		    	done(null, user);
		  	})
		  	.error(function(err)
		  	{
		    	done(err, null);
			});
		});

		passport.use(new LocalStrategy(
			function(username, password, done)
			{
		   		Printspot.db.User.find({ where: { username: username }})
		   		.success(function(user)
		   		{
		   			if (!user)
		   			{
		   				done(null, false, { message: 'Unknown user' });
		      		}
		      		else if (password != user.password)
		      		{
			  			done(null, false, { message: 'Invalid password'});
		      		}
		      		else
		      		{
			  			done(null, user);
			  		}
		    	})
		    	.error(function(err)
		    	{
					done(err);
		    	});
		  	}
		));
*/


		/*
Printspot.http.server.register(require('hapi-auth-bearer-token'), function(err)
		{
			server.auth.strategy('simple', 'bearer-access-token', {
				allowQueryToken: true,              // optional, true by default
				allowMultipleHeaders: false,        // optional, false by default
				accessTokenName: 'access_token',    // optional, 'access_token' by default
				validateFunc: function( token, callback )
				{
		            // For convenience, the request object can be accessed
		            // from `this` within validateFunc.
		            var request = this;

		            // Use a real strategy here,
		            // comparing with a token from your database for example
		            if(token === "1234")
		            {
		                callback(null, true, { token: token });
		            }
		            else
		            {
		                callback(null, false, { token: token });
		            }
		        }
			});
		});
*/
	}
}