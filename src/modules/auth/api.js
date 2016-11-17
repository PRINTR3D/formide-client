/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var request = require('request');

module.exports = function(routes, module) {

	/**
	 * @api {POST} /api/auth/login Local login
	 * @apiGroup Auth
	 * @apiDescription Local user login with email and password
	 * @apiVersion 1.0.0
	 */
	routes.post('/login', FormideClient.http.auth.authenticate('local-login'), (req, res) => {
		if (req.user.id === null) {
			return res.notFound();
		}
		var permissions = [];
		if (req.user.isOwner) permissions.push("owner");
		if (req.user.isAdmin) permissions.push("admin");
		FormideClient.db.AccessToken
			.create({
				createdBy:		req.user.id,
				sessionOrigin:	"local",
				permissions:	permissions
			})
			.then((accessToken) => {
				return res.ok({ access_token: accessToken.token });
			})
			.catch(res.serverError);
	});

	/**
	 * @api {GET} /api/auth/session Get current session
	 * @apiGroup Auth
	 * @apiDescription Get current session from access token
	 * @apiVersion 1.0.0
	 */
	routes.get('/session', FormideClient.http.permissions.isUser, (req, res) => {
		FormideClient.db.AccessToken
		.findOne({ token: req.token })
		.populate('createdBy')
		.exec(function (err, accessToken) {
			if (err) return res.serverError(err);
			return res.ok(accessToken);
		});
	});

	/**
	 * @api {GET} /api/auth/tokens Get tokens
	 * @apiGroup Auth
	 * @apiDescription Get all access tokens from the database
	 * @apiVersion 1.0.0
	 */
	routes.get('/tokens', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.AccessToken
		.find()
		.populate('createdBy')
		.then(res.ok)
		.catch(res.serverError);
	});

	/**
	 * @api {POST} /api/auth/tokens Create token
	 * @apiGroup Auth
	 * @apiDescription Generate an access token manually with the asked permissions. Useful for development purposes.
	 * @apiVersion 1.0.0
	 */
	routes.post('/tokens', FormideClient.http.permissions.isUser, FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.AccessToken
		.create({
			permissions:	req.body.permissions,
			createdBy:		req.user.id,
			sessionOrigin:	'local'
		})
		.then((accessToken) => {
			return res.ok({ message: 'Access token created', token: accessToken.token });
		})
		.catch(res.serverError);
	});

	/**
	 * @api {DELETE} /api/auth/tokens/:token Delete token
	 * @apiGroup Auth
	 * @apiDescription Delete access token, forcing a user to login again
	 * @apiVersion 1.0.0
	 */
	routes.delete('/tokens/:token', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.AccessToken
		.destroy({ token: req.params.token })
		.then(() => {
			return res.ok({ message: 'Access token deleted' })
		})
		.catch(res.serverError);
	});

	/**
	 * @api {GET} /api/auth/users Get users
	 * @apiGroup Auth
	 * @apiDescription Get a list of users
	 * @apiVersion 1.0.0
	 */
	routes.get('/users', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.User
		.find()
		.then(res.ok)
		.catch(res.serverError);
	});

	/**
	 * @api {GET} /api/auth/users/:id Get single user
	 * @apiGroup Auth
	 * @apiDescription Get a single user by ID
	 * @apiVersion 1.0.0
	 */
	routes.get('/users/:id', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.User
		.findOne({ id: req.params.id })
		.then((user) => {
			if (!user) return res.notFound();
			return res.ok(user);
		})
		.catch(res.serverError);
	});

	/**
	 * @api {POST} /api/auth/users Create user
	 * @apiGroup Auth
	 * @apiDescription Create a new user
	 * @apiVersion 1.0.0
	 */
	routes.post('/users', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.User
		.create({
			email:	  req.body.email,
			password: req.body.password,
			isAdmin:  req.body.isAdmin
		})
		.then((user) => {
			return res.ok({ message: "User created", user });
		})
		.catch(res.serverError);
	});

	/**
	 * @api {PUT} /api/auth/users/:id Update user
	 * @apiGroup Auth
	 * @apiDescription Update user settings
	 * @apiVersion 1.0.0
	 */
	routes.put('/users/:id', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.User
		.update({ id: req.params.id }, {
			email:	  req.body.email,
			password: req.body.password,
			isAdmin:  req.body.isAdmin
		})
		.then((updated) => {
			return res.ok({ message: "User updated", user: updated[0] });
		})
		.catch(res.serverError);
	});

	/**
	 * @api {DELETE} /api/auth/users/:id Delete user
	 * @apiGroup Auth
	 * @apiDescription Delete a user from the database
	 * @apiVersion 1.0.0
	 */
	routes.delete('/users/:id', FormideClient.http.permissions.isAdmin, (req, res) => {
		FormideClient.db.User
		.destroy({ id: req.params.id })
		.then(() => {
			return res.ok({ message: "User deleted" });
		})
		.catch(res.serverError);
	});
};
