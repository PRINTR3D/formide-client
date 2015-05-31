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
	routes.get('/modelfiles', FormideOS.manager('core.http').server.permissions.check('rest:modelfile'), function(req, res) {
		db.Modelfile.find().exec(function(err, modelfiles) {
			if (err) return res.send(err);
			return res.send(modelfiles);
		});
	});

	routes.get('/modelfiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:modelfile'), function(req, res) {
		db.Modelfile.findOne({ _id: req.params.id }).exec(function(err, modelfile) {
			if (err) return res.send(err);
			return res.send(modelfile);
		});
	});

	routes.delete('/modelfiles/:id', FormideOS.manager('core.http').server.permissions.check('rest:modelfile'), function(req, res) {
		db.Modelfile.remove({ _id: req.params.id }, function(err, modelfile) {
			if (err) return res.status(400).send(err);
			if (modelfile) {
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