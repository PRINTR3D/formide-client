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
	 * Take a snapshot of the printer
	 */
	routes.get('/info', function( req, res )
	{
		var config = {
			environment: FormideOS.config.environment,
			ports: {
				app: FormideOS.config.get('app.port'),
				client: FormideOS.config.get('printer.port'),
				slicer: FormideOS.config.get('slicer.port'),
				interface: FormideOS.config.get('dashboard.port')
			},
			version: FormideOS.config.get('app.version'),
			debug: FormideOS.config.get('app.debug'),
			cloud: {
				url: FormideOS.config.get('cloud.url')
			},
			mac: FormideOS.macAddress
		}

		res.send(config);
	});
}