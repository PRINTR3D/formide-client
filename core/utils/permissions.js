/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	
 */
 
var permissions = FormideOS.config.get('auth.permissions');

module.exports = {
	
	get: function() {
		return permissions;
	},
	
	add: function(permission) {
		if (permissions[permission] === undefined) {
			permissions.push(permission);
		}
		else {
			FormideOS.debug.log("Permission already exists");
		}
	},
	
	check: function(needsPermissions, hasPermissions) {
		if (typeof hasPermissions === 'string') {
			if (permissions.indexOf(hasPermissions) > -1) {
				if (needsPermissions.indexOf(hasPermissions) > -1) {
					return true;
				}
				FormideOS.debug.log("Permission not added to system");
			}
			FormideOS.debug.log("No permission: " + hasPermissions);
			return false;
		}
		else if (typeof hasPermissions === 'object') {
			for (var i in hasPermissions) {
				if (permissions.indexOf(hasPermissions[i]) === -1) {
					FormideOS.debug.log("Permission not added to system");
					return false;
				}
				if (needsPermissions.indexOf(hasPermissions[i]) === -1) {
					FormideOS.debug.log("No permission: " + hasPermissions[i]);
					return false
				}
			}
			return true;
		}
		else {
			FormideOS.debug.log("Permissions should be string or array");
			return false;
		}
	}
}