/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {
	
	require('./rest/material.js')(routes, module.db);
	require('./rest/modelfile.js')(routes, module.db);
	require('./rest/gcodefile.js')(routes, module.db);
	require('./rest/printer.js')(routes, module.db);
	require('./rest/printjob.js')(routes, module.db);
	require('./rest/queue.js')(routes, module.db);
	require('./rest/sliceprofile.js')(routes, module.db);
};