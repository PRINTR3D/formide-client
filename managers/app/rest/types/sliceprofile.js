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
	routes.get('/sliceprofiles', FormideOS.manager('core.http').server.permissions.check('rest:sliceprofile'), function(req, res) {
		db.Sliceprofile.find().exec(function(err, sliceprofiles) {
			if (err) return res.send(err);
			return res.send(sliceprofiles);
		});
	});

	routes.get('/sliceprofiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:sliceprofile'), function(req, res) {
		db.Sliceprofile.findOne({ _id: req.params.id }).exec(function(err, sliceprofile) {
			if (err) return res.send(err);
			return res.send(sliceprofile);
		});
	});

	routes.post('/sliceprofiles', FormideOS.manager('core.http').server.permissions.check('rest:sliceprofile'), function(req, res) {
		db.Sliceprofile.create(req.body, function(err, sliceprofile) {
			if (err) return res.status(400).send(err);
			if (sliceprofile) {
				return res.send({
					sliceprofile: sliceprofile,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.put('/sliceprofiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:sliceprofile'), function(req, res) {
		db.Sliceprofile.update({ _id: req.params.id }, req.body, function(err, sliceprofile) {
			if (err) return res.status(400).send(err);
			if (sliceprofile) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.delete('/sliceprofiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:sliceprofile'), function(req, res) {
		db.Sliceprofile.remove({ _id: req.params.id }, function(err, sliceprofile) {
			if (err) return res.status(400).send(err);
			if (sliceprofile) {
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