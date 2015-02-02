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

module.exports = function(app, macAddress)
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

	app.get('/device', function(req, res)
	{
		var config = {
			"environment": Printspot.config.__environment,
			"ports": {
				"app": Printspot.config.get('app.port'),
				"client": Printspot.config.get('printer.port'),
				"slicer": Printspot.config.get('slicer.port'),
				"interface": Printspot.config.get('dashboard.port')
			},
			"version": Printspot.config.get('app.version'),
			"debug": Printspot.config.get('app.debug'),
			"cloud": {
				"url": Printspot.config.get('cloud.url'),
				"port": Printspot.config.get('cloud.port')
			},
			"mac": macAddress
		};
		res.send(config);
	});

	app.post('/logout', function(req, res)
	{
		req.logOut();
		res.send(200);
	});

	app.post('/changepassword', function(req, res)
	{
		if(req.body.password)
		{
			Printspot.db.User.find({where: {id: req.user.id}})
		  	.success(function(user)
		  	{
			  	user.updateAttributes({ password: req.body.password }, ['password']).success(function()
				{
					res.send('OK');
				});
		  	});
	  	}
	});

	app.post('/settings', function(req, res)
	{
		if(req.isAuthenticated())
		{
			// do something with user settings
		}
	});
};