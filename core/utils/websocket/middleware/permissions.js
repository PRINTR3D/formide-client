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
							FormideOS.debug.log('Socket permissions incorrect');
							s.disconnect();
						}
					}
				}
			}
		});
	});
	next(null, true);
};

module.exports = permissionsMiddleware;