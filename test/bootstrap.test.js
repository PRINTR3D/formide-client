'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

// Dependencies
var pkg 	= require('../package.json');
var path 	= require('path');

function loadFormideClient() {
    // Load formideos core file
    require('../core/FormideOS')(function (err) {
    	if (err) throw err;

    	// Log awesome app starter logo
    	// require('./core/utils/logLogo');

    	// Log app header
    	FormideOS.log.info('==============================================');
    	FormideOS.log.info('Starting formide-client v' + pkg.version + ' as ' + process.env.NODE_ENV);
    	FormideOS.log.info('==============================================');

    	// Load core modules
    	FormideOS.moduleManager.loadModule('/core/modules/db',			'db',           true);
    	// FormideOS.moduleManager.loadModule('/core/modules/settings',	'settings',     true);
    	FormideOS.moduleManager.loadModule('/core/modules/auth',		'auth',         true);

    	// Activate all loaded modules
    	FormideOS.moduleManager.activateLoadedModules();

        // tests
        require('./request.js')(FormideOS.http.app);
    });
}
