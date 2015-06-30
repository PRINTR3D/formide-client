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
	/**
	 * Get a list of printer commands
	 */
	routes.get('/list', function(req, res) {
		res.send(FormideOS.config.get('channels.dashboard'));
	});

	/**
	 * Get the current status of the printer
	 */
	routes.get('/status', function(req, res) {
		module.getStatus(function(status) {
			return res.json(status);
		});
	});
	
	routes.get('/control/start', function(req, res) {
		module.startPrint(req.query.hash, function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/control/stop', function(req, res) {
		module.stopPrint(function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/control/pause', function(req, res) {
		module.pausePrint(function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/control/resume', function(req, res) {
		module.resumePrint(function(err, result) {
			if (err) return res.send(err);
			return res.json({
				success: true,
				message: result
			});
		});
	});
	
	routes.get('/control/:command', function(req, res) {
		module.printerControl({ command: req.params.command, parameters: req.query }, function(err, result) {
			return res.sendStatus(result);
		});
	});
	

	/**
	 * Send a command to the printer
	 */
	routes.get('/controlOld/:command', function(req, res) {
		// load channels from config
		Object.keys(FormideOS.config.get('printer.dashboard')).forEach(function(method) {
			(function(realMethod) {
				if(req.params.command == realMethod) {
					FormideOS.debug.log('Control printer ' + realMethod);

					var expected = FormideOS.config.get('printer.dashboard')[realMethod];
					var given = req.query;
					var correct = true;

					for(key in expected) {
						if(!given.hasOwnProperty(expected[key])) {
							correct = false;
						}
					};

					if(correct) {
						if(req.params.command == 'start') {
							req.query.hash = FormideOS.appRoot + FormideOS.config.get('paths.gcode') + '/' + req.query.hash;
						}

						var params = JSON.stringify(req.query);
						params = JSON.parse(params, function( k, v ) {
							if(k === "") return v;

							if(!parseInt(v)) {
								return v;
							}
							else {
								return parseInt(v);
							}
						});

						var json = {
							"type": realMethod,
							"data": params
						};

						module.printerControl(json);

						return res.send({
							status: 200,
							message: 'OK'
						});
					}
					else {
						return res.send({
							status: 402,
							errors: 'ERR: param missing'
						});
					}
				}
			})(method);
		});
	});
}