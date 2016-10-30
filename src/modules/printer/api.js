'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {

	/*
	 * Get list of connected printers and their status
	 */
	routes.get('/', function(req, res) {
		return res.ok(module.getPrinters());
	});

	/**
	 * Get a list of printer commands
	 */
	routes.get('/:port/commands', function(req, res) {
		module.getCommands(req.params.port, function(err, commands) {
			if (err) return res.serverError(err);
			return res.ok(commands);
		});
	});

	/**
	 * Get the current status of the printer
	 */
	routes.get('/:port/status', function(req, res) {
		module.getStatus(req.params.port, function(err, status) {
			if (err) return res.serverError(err);
			if (!status) return res.notFound('No printer on this port');
			return res.ok(status);
		});
	});

	/*
	 * Start printjob
	 */
	routes.get('/:port/start', function(req, res) {
		module.startPrint(req.params.port, req.query.queueItem, function(err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Printer starting" });
		});
	});

	/*
	 * Stop printjob
	 */
	routes.get('/:port/stop', function (req, res) {
		module.stopPrint(req.params.port, function(err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Printer stopping" });
		});
	});

	/*
	 * Pause printjob
	 */
	routes.get('/:port/pause', function (req, res) {
		module.pausePrint(req.params.port, function(err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Printer pausing" });
		});
	});

	/**
	 * Resume printjob
	 */
	routes.get('/:port/resume', function (req, res) {
		module.resumePrint(req.params.port, function(err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Printer resuming" });
		});
	});

	/**
	 * Send command to printer
	 */
	routes.post('/:port/gcode', function(req, res) {
		module.gcode(req.params.port, req.body.command, function (err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Tune command executing" });
		});
	});

	/**
	 * Send command to printer while it's printing (tune)
	 */
	routes.post('/:port/tune', function(req, res) {
		module.tuneGcode(req.params.port, req.body.command, function (err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Tune command executing" });
		});
	});

	/**
	 * Start printing a file from disk
        */
	routes.get('/:port/print', function (req, res) {
		module.printFile(req.params.port, req.query.file, function (err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Started printing file" });
		});
	});

	/**
	 * Send command to printer
	 */
	routes.get('/:port/:command', function(req, res) {
		module.printerControl(req.params.port, { command: req.params.command, parameters: req.query }, function (err, result) {
			if (err) return res.serverError(err);
			if (!result) return res.notFound('No printer on this port');
			return res.ok({ message: "Command executing" });
		});
	});

	// get control mode
	routes.get('/control_mode', function (req, res) {
		module.getControlMode(function (err, mode) {
			if (err) return res.serverError(err);
			if (!mode) return res.notFound('Control mode could not be determined');
			return res.ok({
				mode: mode,
				message: 'Control mode found'
			});
		})
	});

	// set control mode
	routes.post('/control_mode', function (req, res) {
		if (!req.body.mode)
			return res.badRequest('Mode not found in body');

		module.setControlMode(function (err, response) {
			if (err) return res.serverError(err);
			return res.ok({
				message: `Control mode set to ${req.body.mode}`
			});
		});
	});
};
