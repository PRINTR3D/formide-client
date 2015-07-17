/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	routes.get('/printers', FormideOS.http.permissions.check('db:printer:read'), function(req, res) {
		db.Printer.find().exec(function(err, printers) {
			if (err) return res.send(err);
			return res.send(printers);
		});
	});

	routes.get('/printers/:id', FormideOS.http.permissions.check('db:printer:read'), function(req, res) {
		db.Printer.findOne({ _id: req.params.id }).exec(function(err, printer) {
			if (err) return res.send(err);
			return res.send(printer);
		});
	});

	routes.post('/printers', FormideOS.http.permissions.check('db:printer:write'), function(req, res) {
		db.Printer.create(req.body, function(err, printer) {
			if (err) return res.status(400).send(err);
			if (printer) {
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

	routes.put('/printers/:id', FormideOS.http.permissions.check('db:printer:write'), function(req, res) {
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

	routes.delete('/printers/:id', FormideOS.http.permissions.check('db:printer:write'), function(req, res) {
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