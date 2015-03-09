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

module.exports = function(routes, module)
{
	require('./types/material.js')(routes, module.db);
	require('./types/modelfile.js')(routes, module.db);
	require('./types/printer.js')(routes, module.db);
	require('./types/printjob.js')(routes, module.db);
	require('./types/queue.js')(routes, module.db);
	require('./types/sliceprofile.js')(routes, module.db);
	require('./types/user.js')(routes, module.db);
};