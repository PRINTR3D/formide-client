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

var restful = require('epilogue');

module.exports = function()
{
	restful.initialize({
		app: Printspot.http.app,
		sequelize: Printspot.db.sequelize
	});

	require('./resources/material.js')(Printspot.db, restful);
	require('./resources/modelfile.js')(Printspot.db, restful);
	require('./resources/printer.js')(Printspot.db, restful);
	require('./resources/printjob.js')(Printspot.db, restful);
	require('./resources/queue.js')(Printspot.db, restful);
	require('./resources/sliceprofile.js')(Printspot.db, restful);
	require('./resources/user.js')(Printspot.db, restful);
};