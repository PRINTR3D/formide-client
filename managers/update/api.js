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

module.exports = function(server, module)
{
	server.route([

		{
			method: 'GET',
			path: '/api/update/get',
			handler: function(req, res)
			{
				res(module.update);
			}
		},

		{
			method: 'GET',
			path: '/api/update/start',
			handler: function(req, res)
			{
				module.download();
				res('OK');
			}
		},

		{
			method: 'GET',
			path: '/api/update/progress',
			handler: function(req, res)
			{
				res(module.progress);
			}
		}

	]);
}