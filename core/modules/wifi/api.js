/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {
	routes.get('/client/:ssid/:password', function(req, res) {
		module.connect(req.params.ssid, req.params,password, function(response) {
			res.send(response);
		});
	});

	routes.get('/ap/:ssid/:password', function(req, res) {

	});
}