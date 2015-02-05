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

module.exports = function(server)
{
	/**
	 * Set led rgb color
	 */
	server.route({
		method: 'GET',
		path: '/api/led/rgb/{r}/{g}/{b}',
		handler: function(req, res)
		{
			var led = Printspot.manager('led').led;
			led.rgb(req.params.r, req.params.g, req.params.b);
			res({status: 200, message: 'OK'});
		}
	});
}