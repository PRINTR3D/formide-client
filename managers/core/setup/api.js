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
	 * Get list of networks
	 */
	routes.get('/networks', function( req, res )
	{
		module.listNetworks(function( networks )
		{
			res.send( networks );
		});
	});

	/**
	 * Send token and wifi credentials
	 */
	routes.post('/token', function( req, res )
	{
		req.checkBody('wifi_ssid', 'wifi_ssid invalid').notEmpty();
		req.checkBody('wifi_password', 'wifi_password invalid').notEmpty();
		req.checkBody('registertoken', 'token invalid').notEmpty();

		var inputErrors = req.validationErrors();
		if( inputErrors )
		{
			return res.status(400).json({
				status: 400,
				errors: inputErrors
			});
		}

		module.registerToCloud( req.body.wifi_ssid, req.body.wifi_password, req.body.registertoken );
		return res.send({
			status: 200,
			message: 'OK'
		});
	});
};