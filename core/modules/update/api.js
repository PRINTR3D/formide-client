/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
var fs = require('fs');

module.exports = function(routes, module) {
	
	routes.get('/core', function(req, res) {
		var pkg = fs.readFileSync(FormideOS.appRoot + 'package.json', 'utf8');
		pkg = JSON.parse(pkg);
		
		var config = {
			environment: FormideOS.config.environment,
			ports: {
				app: FormideOS.config.get('app.port'),
				slicer: FormideOS.config.get('slicer.port')
			},
			debug: FormideOS.config.get('app.debug'),
			cloud: {
				url: FormideOS.config.get('cloud.url')
			},
			mac: FormideOS.macAddress,
			pkg: pkg,
			version: pkg.version
		};
		
		return res.json(config);
	});
	
	routes.get('/core/update', function(req, res) {
		module.updateOS(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules', function(req, res) {
		module.getPackages(false, function(modules) {
			return res.json(modules);
		});
	});
	
	routes.get('/modules/install', function(req, res) {
		if (!req.query.moduleName) return res.json({ success: false, data: 'no moduleName given'});
		module.installPackage(req.query.moduleName, function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/outdated', function(req, res) {
		module.outdatedPackages(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/:moduleName', function(req, res) {
		if (!req.params.moduleName) return res.json({ success: false, data: 'no moduleName given'});
		module.getPackage(req.params.moduleName, function(modules) {
			return res.json(modules);
		});
	});
	
	routes.get('/modules/:moduleName/update', function(req, res) {
		if (!req.params.moduleName) return res.json({ success: false, data: 'no packageName given'});
		module.updateSinglePackage(req.params.moduleName, function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/:moduleName/uninstall', function(req, res) {
		if (!req.params.moduleName) return res.json({ success: false, data: 'no moduleName given'});
		module.uninstallPackage(req.params.moduleName, function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
}