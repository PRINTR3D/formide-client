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
	
	require('./rest/material.js')(routes, module.db);
	require('./rest/modelfile.js')(routes, module.db);
	require('./rest/gcodefile.js')(routes, module.db);
	require('./rest/printer.js')(routes, module.db);
	require('./rest/printjob.js')(routes, module.db);
	require('./rest/queue.js')(routes, module.db);
	require('./rest/sliceprofile.js')(routes, module.db);
};