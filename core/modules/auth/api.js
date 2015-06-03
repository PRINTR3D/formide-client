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

var passwordHash = require('password-hash');

module.exports = function(routes, module)
{
	routes.post('/login', FormideOS.manager('core.http').server.auth.authenticate('local-login'), function(req, res) {
		return res.send({
			success: true,
			sessionID: req.sessionID
		});
	});

	routes.get('/logout', function(req, res) {
		req.logout();
		return res.send({
			success: true
		});
	});

	routes.get('/session', function(req, res) {
		return res.send({
			sessionID: req.sessionID,
			status: 'logged in'
		});
	});

	routes.get('/tokens', FormideOS.manager('core.http').server.permissions.check('auth'), function( req, res ) {
		module.getAccessTokens(function(tokens) {
			return res.send(tokens);
		});
	});

	routes.post('/tokens', FormideOS.manager('core.http').server.permissions.check('auth'), function(req, res) {
		req.checkBody('permissions', 'permissions invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if(inputErrors) {
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		module.generateAccessToken( req.body.permissions, function(token) {
			return res.send(token);
		});
	});

	routes.delete('/tokens/:token', FormideOS.manager('core.http').server.permissions.check('auth'), function(req, res) {
		req.checkParams('token', 'token invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if(inputErrors) {
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		module.deleteAccessToken( req.params.token, function(response) {
			res.send(response);
		});
	});

	routes.post('/password', FormideOS.manager('core.http').server.permissions.check('auth'), function(req, res) {
		if(req.body.password) {
			module.changePassword(req.body.password, function(response) {
				res.send(response);
			});
		}
	});
	
	// user config
	routes.get('/users', FormideOS.manager('core.http').server.permissions.check('rest:user'), function(req, res) {
		db.User.find().exec(function(err, users) {
			if (err) return res.send(err);
			return res.send(users);
		});
	});

	routes.get('/users/:id', FormideOS.manager('core.http').server.permissions.check('rest:user'), function(req, res) {
		db.User.findOne({ _id: req.params.id }).exec(function(err, user) {
			if (err) return res.send(err);
			return res.send(user);
		});
	});

	routes.post('/users', FormideOS.manager('core.http').server.permissions.check('rest:user'), function(req, res) {
		db.User.create(req.body).exec(function(err, user) {
			if (err) return res.status(400).send(err);
			if (user) {
				return res.send({
					user: user,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.put('/users/:id', FormideOS.manager('core.http').server.permissions.check('rest:user'), function(req, res) {
		db.User.update({ _id: req.params.id }, req.body, function(err, user) {
			if (err) return res.status(400).send(err);
			if (user) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.delete('/users/:id', FormideOS.manager('core.http').server.permissions.check('rest:user'), function(req, res) {
		db.User.remove({ _id: req.params.id }, function(err, user) {
			if (err) return res.status(400).send(err);
			if (user) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});
};