/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

/*
 *	This is the bootstrap of formide-client. It kicks off the formide-client src
 *	and loads the src modules. After that, all user installed modules are loaded. Finally,
 *	all loaded modules are activated via the moduleManager.activateLoadedModules function.
 */

console.time('boot time');

// Dependencies
pkg 	           = require('./package.json');
var moduleConfig   = null;

try {
	moduleConfig = require('./modules.json');
}
catch(e) {
	console.error('Could not load modules.json', e);
	process.exit(1);
}

// set default env
if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'production';

// catch uncaught connection errors
process.on('uncaughtException', function(error) {
	console.error((new Date).toUTCString() + ' uncaughtException:', error.message)
	console.error(error.stack);
	
	if (error.message.indexOf('ECONNRESET') > -1) {
		console.error('Caught ECONNRESET, not exiting...')
	} else {
		process.exit(1)
	}
})

// Load formide-client src file
const initFormide = require('./src/FormideClient');

initFormide().then(() => {

	// Log awesome app starter logo
	require('./src/utils/logLogo');

	// Log app header
	FormideClient.log.info('==============================================');
	FormideClient.log.info('Starting formide-client v' + pkg.version + ' as ' + process.env.NODE_ENV);
	FormideClient.log.info('==============================================');

	// Load modules
	for (var module in moduleConfig.modules) {
		FormideClient.moduleManager.loadModule(moduleConfig.modules[module].path, module);
	}

	// Activate all loaded modules
	FormideClient.moduleManager.activateLoadedModules();

	console.timeEnd('boot time');
});