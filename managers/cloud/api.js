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

var token = null;

module.exports = function(server, module)
{
	/**
	 * Redirect to register url
	 */
	server.route({
		method: 'GET',
		path: '/api/cloud/register',
		handler: function(req, res)
		{
			return res(Printspot.config.get('cloud.authUrl') + '?client_id=' + Printspot.macAddress + '&redirect_uri=' + Printspot.http.server.info.uri + '/api/cloud/redirect');
		}
	});

	/**
	 * Receive registration redirect
	 */
	server.route({
		method: 'GET',
		path: '/api/cloud/redirect',
		handler: function(req, res)
		{
			token = req.query.token;
			return res.redirect(Printspot.http.server.info.protocol + '://' + Printspot.http.server.info.host + ':' + Printspot.config.get('dashboard.port'));
		}
	});

	/**
	 * Redirect to unregister url
	 */
	server.route({
		method: 'GET',
		path: '/api/cloud/unregister',
		handler: function(req, res)
		{
			token = null;
		}
	});

	server.route({
		method: 'GET',
		path: '/api/cloud/token',
		handler: function(req, res)
		{
			return res(token);
		}
	})
}