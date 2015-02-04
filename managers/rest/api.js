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

module.exports = function(server)
{
	require('./resources/material.js')(Printspot.db, server);
	require('./resources/modelfile.js')(Printspot.db, server);
	require('./resources/printer.js')(Printspot.db, server);
	require('./resources/printjob.js')(Printspot.db, server);
	require('./resources/queue.js')(Printspot.db, server);
	require('./resources/sliceprofile.js')(Printspot.db, server);
	require('./resources/user.js')(Printspot.db, server);
};