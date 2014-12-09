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

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done)
{
	done(null, user.id);
});

passport.deserializeUser(function(id, done)
{
  	global.db.User.find({where: {id: id}})
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
   		global.db.User.find({ where: { username: username }})
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

var auth = function(req, res, next)
{
	if(!req.isAuthenticated())
	{
		res.send(401);
	}
	else
	{
		next();
	}
};

module.exports = exports = function(app)
{
	app.use(passport.initialize());
	app.use(passport.session());

	app.post('/login', passport.authenticate('local'), function(req, res)
	{
		res.send(req.user);
	});

	app.get('/session', function(req, res)
	{
		res.send(req.isAuthenticated() ? req.user : '0');
	});

	app.post('/logout', function(req, res)
	{
		req.logOut();
		res.send(200);
	});
};