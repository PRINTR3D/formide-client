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

module.exports = function(routes, module)
{
	routes.get('/', function(req, res) {
		return res.send(module.getPrinters());
	});
	
	/**
	 * Get a list of printer commands
	 */
	routes.get('/commands', function(req, res) {
		return res.send(FormideOS.config.get('printer.dashboard'));
	});

	/**
	 * Get the current status of the printer
	 */
	routes.get('/:port/status', function(req, res) {
		module.getStatus(req.params.port, function(status) {
			return res.json(status);
		});
	});
	
	routes.get('/:port/start', function(req, res) {
		module.startPrint(req.params.port, req.query.hash, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/stop', function(req, res) {
		module.stopPrint(req.params.port, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/pause', function(req, res) {
		module.pausePrint(req.params.port, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/resume', function(req, res) {
		module.resumePrint(req.params.port, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/:port/:command', function(req, res) {
		module.printerControl(req.params.port, { command: req.params.command, parameters: req.query }, function(err, result) {
			return res.sendStatus(result);
		});
	});
}