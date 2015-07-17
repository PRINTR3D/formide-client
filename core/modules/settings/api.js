/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {

	routes.get('/', FormideOS.http.permissions.check('settings:read'), function(req, res) {
		module.getSettings(function(settings) {
			return res.send(settings);
		});
	});
	
	routes.get('/exposed', FormideOS.http.permissions.check('settings:read'), function(req, res) {
		module.getExposedSettings(function(settings) {
			return res.send(settings);
		});
	});
	
	routes.get('/:moduleName', FormideOS.http.permissions.check('settings:read'), function(req, res) {
		module.getModuleSettings(req.params.moduleName, function(settings) {
			return res.send(settings);
		});
	});
	
	routes.post('/:moduleName', FormideOS.http.permissions.check('settings:write'), function(req, res) {
		module.saveModuleSettings(req.params.moduleName, req.body, function(settings) {
			return res.send(settings);
		});
	});
};