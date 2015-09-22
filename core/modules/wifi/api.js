/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {
	
	routes.get('/connect', function(req, res) {
		module.connectToNetwork(req.query.ssid, req.query.password, function(err, success) {
			if (err) return res.send(err);
			return res.send({
				message: success
			});
		});
	});
	
	routes.get('/accesspoint', function(req, res) {
		module.setupAccessPoint(function(err, success) {
			if (err) return res.send(err);
			return res.send({
				message: success
			});
		});
	});
	
	routes.get('/list', function(req, res) {
		module.list(function(err, networks) {
			if (err) return res.send(err);
			return res.send(networks);
		});
	});
}