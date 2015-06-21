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

module.exports = {
	
	initialize: function() {
		var self = this;

		return function( req, res, next ) {
			req._permissions = {};
			req._permissions.instance = self;

			if(req.user) {
				FormideOS.debug.log( 'Session set and permissions found in session' );
				var permissions = req.user.permissions || [];
				req._permissions.session = true;
				req.session['permissions'] = permissions;
				req._permissions.permissions = req.session['permissions'];
			}
			else if(req.token && req.token == FormideOS.module('settings').getSetting('cloud', 'accesstoken')) {
				FormideOS.debug.log( 'Session set and permissions found in cloud session' );
				var permissions = [];
				
				// filter for permissions cloud available and add
				// this whole structure will be changed in the future to support multiple cloud users with their own permissions!
				for(var i in FormideOS.module('settings').getModuleSettings('cloud')) {
					if(i.indexOf('permission') > -1) {
						// add permisission to permissions when valid is true
						var valid = FormideOS.module('settings').getSetting('cloud', i);
						if(valid) {
							var permission = i.split('_')[1];
							permissions.push(permission);
						}
					}
				}
				
				req._permissions.session = true;
				req.session['permissions'] = permissions;
				req._permissions.permissions = req.session['permissions'];
			}
			else {
				FormideOS.debug.log( 'Session not set' );
				req._permissions.session = false;
			}

			return next();
		}
	},

	check: function(permission, permissionNeeded) {

		if (permissionNeeded === undefined) permissionNeeded = true;
		
		return function(req, res, next) {
			
			if(!permissionNeeded) {
				return next();
			}
			
			if(req._permissions.session) {
				if (req._permissions.permissions.indexOf(permission) > -1) {
					FormideOS.debug.log('Permissions correct');
					return next();
				}
			}

			FormideOS.debug.log('Permissions incorrect');

			return res.status(401).send({
				status: 401,
				errors: 'No permission'
			});
		}
	}
}