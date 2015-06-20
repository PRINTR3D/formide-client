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

module.exports = function(routes, module) {
	
	routes.get('/core/update', function(req, res) {
		module.updateOS(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/core/clean', function(req, res) {
		// somehow clean the core
	});
	
	routes.get('/core/reset', function(req, res) {
		// completely re-install the core
	});
	
	routes.get('/modules', function(req, res) {
		module.getPackages(false, function(modules) {
			return res.json(modules);
		});
	});
	
	routes.get('/modules/:moduleName', function(req, res) {
		if (!req.params.moduleName) return res.json({ success: false, data: 'no moduleName given'});
		module.getPackage(req.params.moduleName, function(modules) {
			return res.json(modules);
		});
	});
	
	routes.get('/modules/updateall', function(req, res) {
		module.updatePackages(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/:moduleName/update', function(req, res) {
		if (!req.params.moduleName) return res.json({ success: false, data: 'no packageName given'});
		module.updateSinglePackage(req.params.moduleName, req.query.version || "latest", function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/install', function(req, res) {
		if (!req.query.moduleName) return res.json({ success: false, data: 'no moduleName given'});
		module.installPackage(req.query.moduleName, function(err, output) {
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
	
	routes.get('/modules/outdated', function(req, res) {
		module.outdatedPackages(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
/*
	routes.post('/start', function( req, res )
	{
		module.download();
		res.send('OK');
	});

	ruoutes.get('/progress', function( req, res )
	{
		res.send(module.progress);
	});
*/
}