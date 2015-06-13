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

var io 							= require('socket.io');
var authorizationMiddleware 	= require('./middleware/authorization');
var permissionsMiddleware 		= require('./middleware/permissions');

module.exports =
{
	name: "core.websocket",
	
	connection: {},

	init: function()
	{
		this.connection = io.listen( FormideOS.manager('core.http').server.server );

		this.connection.use(authorizationMiddleware);
		this.connection.use(permissionsMiddleware);

		FormideOS.manager('debug').log('websocket api running on port ' + FormideOS.config.get('app.port') );
	}
}