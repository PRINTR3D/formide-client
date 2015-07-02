/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {

	routes.get('/', function(req, res) {
		module.getSettings(function(settings) {
			return res.send(settings);
		});
	});
	
	routes.get('/exposed', function(req, res) {
		module.getExposedSettings(function(settings) {
			return res.send(settings);
		});
	});
	
	routes.get('/:moduleName', function(req, res) {
		module.getModuleSettings(req.params.moduleName, function(settings) {
			return res.send(settings);
		});
	});
	
	routes.post('/:moduleName', function(req, res) {
		module.saveModuleSettings(req.params.moduleName, req.body, function(settings) {
			return res.send(settings);
		});
	});
};