/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
/*
 *	Small piece of middleware to handle permissions. Checks for token in request (query param) and
 *	retreives permissions from database if not set in session yet. This is done for each namespace
 *	so permissions work automatically when adding a new module.
 */
 
var _ = require('underscore');

var permissionsMiddleware = function (socket, next) {
	_.each( socket.server.nsps, function(nsp) {
		nsp.once('connection', function(s) {
			if(s.request.headers.host != '127.0.0.1:1337') { // local conections always work (needed for cloud)
				if (!s.request.session) {
					socket.disconnect();
				}
				else {
					if (nsp.name != '/') {
						if (s.request.session.permissions) {
							if (s.request.session.permissions.indexOf( nsp.name.replace('/', '') ) === -1 ) {
								FormideOS.debug.log('Socket permissions incorrect');
								s.disconnect();
							}
							else {
								FormideOS.debug.log('Socket permissions correct');
							}
						}
						else {
							if (s.request._query.access_token) {
								FormideOS.module('db').db.AccessToken.findOne({ token: s.request._query.access_token }).exec(function(err, accessToken) {
									if (err) {
										FormideOS.debug.log(err);
										s.disconnect();
									}
									if (accessToken == null) {
										FormideOS.debug.log('No access token found');
										s.disconnect();
									}
									else {
										s.request.session.permissions = accessToken.permissions;
										if (s.request.session.permissions.indexOf( nsp.name.replace('/', '') ) === -1 ) {
											FormideOS.debug.log('Socket permissions incorrect');
											s.disconnect();
										}
									}
								});
							}
							else {
								FormideOS.debug.log('No access token found in session or request');
								s.disconnect();
							}
						}
					}
				}
			}
		});
	});
	next(null, true);
};

module.exports = permissionsMiddleware;