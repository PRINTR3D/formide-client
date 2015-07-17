/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module)
{
	routes.get('/', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		return res.send(module.getPrinters());
	});
	
	/**
	 * Get a list of printer commands
	 */
	routes.get('/commands', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		return res.send(FormideOS.config.get('printer.dashboard'));
	});

	/**
	 * Get the current status of the printer
	 */
	routes.get('/:port/status', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		module.getStatus(req.params.port, function(status) {
			return res.json(status);
		});
	});
	
	routes.get('/:port/start', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		module.startPrint(req.params.port, req.query.hash, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/stop', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		module.stopPrint(req.params.port, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/pause', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		module.pausePrint(req.params.port, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/resume', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		module.resumePrint(req.params.port, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/:command', FormideOS.http.permissions.check('printer:control'), function(req, res) {
		module.printerControl(req.params.port, { command: req.params.command, parameters: req.query }, function(err, result) {
			return res.sendStatus(result);
		});
	});
}