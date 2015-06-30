/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var request = require('request');

module.exports = function(routes, module) {
	
	// session things
	routes.post('/login', FormideOS.http.auth.authenticate('local-login'), function(req, res) {	
		FormideOS.module('db').db.AccessToken.generate(req.user, 'local', function(err, accessToken) {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, access_token: accessToken.token });
		});
	});

	routes.get('/session', function(req, res) {
		FormideOS.module('db').db.AccessToken.findOne({ token: req.token }).exec(function(err, accessToken) {
			if (err) return res.json({ success: false, message: err });
			return res.json({ success: true, session: accessToken });
		});
	});

	// accesstoken things
	routes.get('/tokens', FormideOS.http.permissions.check('auth'), function( req, res ) {
		module.getAccessTokens(function(tokens) {
			return res.send(tokens);
		});
	});

	routes.post('/tokens', FormideOS.http.permissions.check('auth'), function(req, res) {
		module.generateAccessToken(req.body.permissions, function(token) {
			return res.send(token);
		});
	});

	routes.delete('/tokens/:token', FormideOS.http.permissions.check('auth'), function(req, res) {
		module.deleteAccessToken( req.params.token, function(err) {
			if (err) return res.send({ success: false, message: err })
			return res.send({ success: true });
		});
	});
	
	// user config
	routes.get('/users', FormideOS.http.permissions.check('auth'), function(req, res) {
		FormideOS.module('db').db.User.find().exec(function(err, users) {
			if (err) return res.send(err);
			return res.send(users);
		});
	});

	routes.get('/users/:id', FormideOS.http.permissions.check('auth'), function(req, res) {
		FormideOS.module('db').db.User.findOne({ _id: req.params.id }).exec(function(err, user) {
			if (err) return res.send(err);
			return res.send(user);
		});
	});
	
	routes.post('/invite', FormideOS.http.permissions.check('auth'), function(req, res) {
		FormideOS.module('db').db.User.create({
			email: req.body.email
		}, function(err, user) {
			if (err) return res.send({ success: false, error: err });
			request({
				method: "POST",
				url: FormideOS.config.get('auth.inviteUrl'),
				form:{
					mac: FormideOS.macAddress,
					email: req.body.email
				},
				strictSSL: false
			}, function( err, httpResponse, body ) {
				if (err) return FormideOS.debug.log('user invitation error ' + err, true);
				var response = JSON.parse(body);
				user.cloudConnectionToken = response.clientToken;
				user.save(function(err, user) {
					if (err) return FormideOS.debug.log(err, true);
					FormideOS.debug.log('cloud user connected with clientToken ' + response.clientToken + '. Still waiting for user to accept');
					return res.send({
						success: true,
						user: user
					});
				});
			});
		});
	});

	routes.post('/users', FormideOS.http.permissions.check('auth'), function(req, res) {
		FormideOS.module('db').db.User.create(req.body, function(err, user) {
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

	routes.put('/users/:id', FormideOS.http.permissions.check('auth'), function(req, res) {
		FormideOS.module('db').db.User.update({ _id: req.params.id }, req.body, function(err, user) {
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

	routes.delete('/users/:id', FormideOS.http.permissions.check('auth'), function(req, res) {
		FormideOS.module('db').db.User.remove({ _id: req.params.id }, function(err, user) {
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