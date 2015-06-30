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
	routes.get('/networks', function(req, res) {
		module.listNetworks(function(networks) {
			res.send(networks);
		});
	});

	/**
	 * Send token and wifi credentials
	 */
	routes.post('/token', function(req, res) {
		module.addUser(req.body.email, req.body.password, req.body.registertoken, function(err, user) {
			if (err) return res.send({ success: false, error: err });
			module.registerToCloud(req.body.wifi_ssid, req.body.wifi_password, user.cloudConnectionToken);
			return res.send({ success: true });
		});
	});
};