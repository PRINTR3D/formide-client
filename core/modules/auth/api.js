/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var request = require('request');

module.exports = function(routes, module) {

	/*
	 * Login. Post an email address and password as body, get a AccessToken object back
	 */
	routes.post('/login', FormideOS.http.auth.authenticate('local-login'), function(req, res) {
		if (req.user.id === null) {
			return res.notFound();
		}
		var permissions = [];
		if (req.user.isOwner) permissions.push("owner");
		if (req.user.isAdmin) permissions.push("admin");
		FormideOS.db.AccessToken.create({
			createdBy: req.user.id,
			sessionOrigin: "local",
			permissions: permissions
		}, function (err, accessToken) {
			if (err) return res.serverError(err);
			return res.ok({
				access_token: accessToken.token
			});
		});
	});

	/*
	 * Get current session. Used permissions.isUser to check AccessToken (req.token), returns success and AccessToken object
	 */
	routes.get('/session', FormideOS.http.permissions.isUser, function(req, res) {
		FormideOS.db.AccessToken
		.findOne({ token: req.token })
		.populate('createdBy')
		.exec(function (err, accessToken) {
			if (err) return res.serverError(err);
			return res.ok(accessToken);
		});
	});

	/*
	 * Get all AccessToken objects from the database
	 */
	routes.get('/tokens', FormideOS.http.permissions.isAdmin, function( req, res ) {
		FormideOS.db.AccessToken
		.find()
		.populate('createdBy')
		.exec( function(err, accessTokens) {
			if (err) return res.serverError(err);
			return res.ok(accessTokens);
		});
	});

	/*
	 * Generate an AccessToken manually with the given permissions (only permission available right now is 'admin')
	 */
	routes.post('/tokens', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.AccessToken.create({
			permissions: req.body.permissions,
			createdBy: req.user.id
		}, function (accessToken) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "Access token created",
				accessToken: accessToken
			});
		});
	});

	/*
	 * Delete AccessToken from database. Basically forces user to login again
	 */
	routes.delete('/tokens/:token', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.AccessToken.destroy({ token: req.params.token }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "Access token deleted"
			})
		});
	});

	/*
	 * Get list of all users
	 */
	routes.get('/users', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.User
		.find()
		.exec(function(err, users) {
			if (err) return res.serverError(err);
			return res.send(users);
		});
	});

	/*
	 * Get a single user object
	 */
	routes.get('/users/:id', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.User
		.findOne({ id: req.params.id })
		.exec(function(err, user) {
			if (err) return res.serverError(err);
			return res.send(user);
		});
	});

	/*
	 * Create a new user. req.body should contain all items that User object has in database
	 */
	routes.post('/users', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.User.create({
			email: req.body.email,
			isAdmin: req.body.isAdmin
		}, function(err, user) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "User created",
				user: user
			});
		});
	});

	/*
	 * Update a user. req.body should contain all the items that User object has in database
	 */
	routes.put('/users/:id', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.User.update({ id: req.params.id }, {
			email: req.body.email,
			isAdmin: req.body.isAdmin
		}, function(err, updated) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "User updated",
				user: updated[0]
			});
		});
	});

	/*
	 * Delete user.
	 */
	routes.delete('/users/:id', FormideOS.http.permissions.isAdmin, function(req, res) {
		FormideOS.db.User.destroy({ id: req.params.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({
				message: "User deleted"
			});
		});
	});
};
