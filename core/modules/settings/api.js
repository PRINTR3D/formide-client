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
	
	/**
	 * Get complete settings object
	 */
	routes.get('/', FormideOS.manager('http').server.permissions.check('settings'), function(req, res) {
		module.getSettings(function(settings) {
			return res.send(settings);
		});
	});
	
	/*
	 * Get installed module overview
	 */
	routes.get('/modules', FormideOS.manager('http').server.permissions.check('settings'), function(req, res) {
		module.getBootstrapInfo(function(bootstrapInfo) {
			return res.send(bootstrapInfo);
		});
	});
	
	/**
	 * Get partial settings object by key
	 */
	routes.get('/:settingName', FormideOS.manager('http').server.permissions.check('settings'), function(req, res) {
		module.getSetting(req.params.settingName, function(setting) {
			return res.send(setting);
		});
	});
	
	routes.post('/:settingName', FormideOS.manager('http').server.permissions.check('settings'), function(req, res) {
		module.saveSetting(req.params.settingName, req.body, function(err, changedSetting) {
			if(err) return res.send(err);
			return res.send({
				success: true,
				setting: changedSetting
			});
		});
	});
	
	routes.delete('/:settingName', FormideOS.manager('http').server.permissions.check('settings'), function(req, res) {
		module.deleteSetting(req.params.settingName, function(err) {
			if(err) return res.send({ success: false, message: err });
			return res.send({
				success: true
			});
		});
	});
};