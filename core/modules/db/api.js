/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {
	
	// require submodules for individual rest resources
	require('./rest/material.js')(routes, FormideOS.db);
	require('./rest/userfile.js')(routes, FormideOS.db);
	require('./rest/printer.js')(routes, FormideOS.db);
	require('./rest/printjob.js')(routes, FormideOS.db);
	require('./rest/queue.js')(routes, FormideOS.db);
	require('./rest/sliceprofile.js')(routes, FormideOS.db);
};