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

module.exports = function(app, sequelize)
{
	restful.initialize({
		app: app,
		sequelize: sequelize
	});

	restful.resource({
	    model: global.Printspot.db.Sliceprofile,
	    endpoints: ['/api/sliceprofiles', '/api/sliceprofiles/:id']
	});

	restful.resource({
	    model: global.Printspot.db.Printjob,
	    endpoints: ['/api/printjobs', '/api/printjobs/:id']
	});

	restful.resource({
	    model: global.Printspot.db.Material,
	    endpoints: ['/api/materials', '/api/materials/:id']
	});

	restful.resource({
	    model: global.Printspot.db.Printer,
	    endpoints: ['/api/printers', '/api/printers/:id']
	});

	restful.resource({
	    model: global.Printspot.db.User,
	    endpoints: ['/api/users', '/api/users/:id']
	});

	restful.resource({
	    model: global.Printspot.db.Modelfile,
	    endpoints: ['/api/modelfiles', '/api/modelfiles/:id']
	});

	restful.resource({
		model: global.Printspot.db.Queueitem,
		endpoints: ['/api/queue', '/api/queue/:id']
	});

	return restful;
};