/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module)
{
	/**
	 * Set led rgb color
	 */
	routes.get('/rgb/:r/:g/:b', function( req, res )
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