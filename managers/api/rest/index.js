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

module.exports = function(app, db, sequelize)
{
	restful.initialize({
		app: app,
		sequelize: sequelize
	});

	require('./material.js')(db, restful);
	require('./modelfile.js')(db, restful);
	require('./printer.js')(db, restful);
	require('./printjob.js')(db, restful);
	require('./queue.js')(db, restful);
	require('./sliceprofile.js')(db, restful);
	require('./user.js')(db, restful);
};