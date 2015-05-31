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

module.exports = function(routes, db)
{
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