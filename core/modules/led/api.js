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
	 * Set led rgb color
	 */
	routes.get('/rgb/:r/:g/:b', FormideOS.manager('http').server.permissions.check('led'), function( req, res )
	{
		req.checkParams('r', 'r invalid').notEmpty().isInt();
		req.checkParams('g', 'g invalid').notEmpty().isInt();
		req.checkParams('b', 'b invalid').notEmpty().isInt();

		if( req.validationErrors() )
		{
			return res.status(400).json({
				status: 400,
				errors: req.validationErrors()
			});
		}

		module.led.rgb(req.params.r, req.params.g, req.params.b);

		return res.send({
			status: 200,
			message: 'OK'
		});
	});
}