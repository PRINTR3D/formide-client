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
	routes.get('/printjobs', FormideOS.manager('core.http').server.permissions.check('rest:printjob'), function(req, res) {
		db.Printjob.find().populate('materials modelfiles printer sliceprofile').exec(function(err, printjobs) {
			if (err) return res.send(err);
			return res.send(printjobs);
		});
	});

	routes.get('/printjobs/:id', FormideOS.manager('core.http').server.permissions.check('rest:printjob'), function(req, res) {
		db.Printjob.findOne({ _id: req.params.id }).populate('materials modelfiles printer sliceprofile').exec(function(err, printjob) {
			if (err) return res.send(err);
			return res.send(printjob);
		});
	});

	routes.delete('/printjobs/:id', FormideOS.manager('core.http').server.permissions.check('rest:printjob'), function(req, res) {
		db.Printjob.remove({ _id: req.params.id }, function(err, printjob) {
			if (err) return res.status(400).send(err);
			if (printjob) {
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