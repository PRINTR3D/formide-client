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
		db.Printer
		.find()
		.exec(function (err, printers) {
			if (err) return res.serverError(err);
			return res.ok(printers);
		});
	});

	/*
	 * Get a single printer object
	 */
	routes.get('/printers/:id', function(req, res) {
		db.Printer
		.findOne({ id: printer.parent.id })
		.exec(function (err, printer) {
			if (err) return res.serverError(err);
			if (!printer) return res.notFound();
			return res.ok(printer);
		});
	});

	/*
	 * Create a new printer object. req.body should contain all items in printer database object
	 */
	routes.post('/printers', function(req, res) {
		db.Printer.create({
			name: req.body.name,
			bed: req.body.bed,
			axis: req.body.axis,
			extruders: req.body.extruders,
			port: req.body.port,
			baudrate: req.body.baudrate,
			gcodeFlavour: req.body.gcodeFlavour,
			startGcode: req.body.startGcode,
			endGcode: req.body.endGcode,
			createdBy: req.user.id,
		}, function (err, printer) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Printer created", printer: printer });
		});
	});

	/*
	 * Update a printer object. req.body should contain all items in printer database object
	 */
	routes.put('/printers/:id', function(req, res) {
		db.Printer.update({ id: req.params.id }, {
			name: req.body.name,
			bed: req.body.bed,
			axis: req.body.axis,
			extruders: req.body.extruders,
			port: req.body.port,
			baudrate: req.body.baudrate,
			gcodeFlavour: req.body.gcodeFlavour,
			startGcode: req.body.startGcode,
			endGcode: req.body.endGcode,
			createdBy: req.user.id
		}, function (err, updated) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Printer updated", printer: updated[0] });
		});
	});

	/*
	 * Delete printer object
	 */
	routes.delete('/printers/:id', function(req, res) {
		db.Printer.destroy({ id: req.params.id }, function (err) {
			if (err) return res.serverError(err);
			return res.ok({ message: "Printer deleted" });
		});
	});
};
