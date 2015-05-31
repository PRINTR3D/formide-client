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
	routes.get('/printers', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function(req, res) {
		db.Printer.find().exec(function(err, printers) {
			if (err) return res.send(err);
			return res.send(printers);
		});
	});

	routes.get('/printers/:id', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function(req, res) {
		db.Printer.findOne({ _id: req.params.id }).exec(function(err, printer) {
			if (err) return res.send(err);
			return res.send(printer);
		});
	});

	routes.post('/printers', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function(req, res) {
		db.Printer.create(req.body, function(err, printer) {
			if (err) return res.status(400).send(err);
			if (modelfile) {
				return res.send({
					printer: printer,
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.put('/printers/:id', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function(req, res) {
		db.Printer.update({ _id: req.params.id }, req.body, function(err, printer) {
			if (err) return res.status(400).send(err);
			if (printer) {
				return res.send({
					success: true
				});
			}
			return res.send({
				success: false
			});
		});
	});

	routes.delete('/printers/:id', FormideOS.manager('core.http').server.permissions.check('rest:printer'), function(req, res) {
		db.Printer.remove({ _id: req.params.id }, function(err, printer) {
			if (err) return res.status(400).send(err);
			if (printer) {
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