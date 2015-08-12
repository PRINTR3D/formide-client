/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, db)
{
	/*
	 * Get a list of printer objects
	 */
	routes.get('/printers', function(req, res) {
		db.Printer.find().exec(function(err, printers) {
			if (err) return res.send(err);
			return res.send(printers);
		});
	});

	/*
	 * Get a single printer object
	 */
	routes.get('/printers/:id', function(req, res) {
		db.Printer.findOne({ _id: req.params.id }).exec(function(err, printer) {
			if (err) return res.send(err);
			return res.send(printer);
		});
	});

	/*
	 * Create a new printer object. req.body should contain all items in printer database object
	 */
	routes.post('/printers', function(req, res) {
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

	/*
	 * Update a printer object. req.body should contain all items in printer database object
	 */
	routes.put('/printers/:id', function(req, res) {
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

	/*
	 * Delete printer object
	 */
	routes.delete('/printers/:id', function(req, res) {
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