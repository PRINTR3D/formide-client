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
	
	routes.get('/os/update', function(req, res) {
		module.updateOS(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/os/clean', function(req, res) {
		// somehow clean the core
	});
	
	routes.get('/os/reset', function(req, res) {
		// completely re-install the core
	});
	
	routes.get('/modules', function(req, res) {
		module.getPackages(false, function(modules) {
			return res.json(modules);
		});
	});
	
	routes.get('/modules/update', function(req, res) {
		module.updatePackages(function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/update/:packageName', function(req, res) {
		module.updateSinglePackage(req.params.packageName, req.query.version || "latest", function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/install', function(req, res) {
		var packageName = req.query.packageName;
		module.installPackage(packageName, function(err, output) {
			if (err) return res.json({ success: false, data: output});
			return res.json({ success: true, data: output});
		});
	});
	
	routes.get('/modules/remove', function(req, res) {
		var packageName = req.query.packageName;
		module.uninstallPackage(packageName, function(err, output) {
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