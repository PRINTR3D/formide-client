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

var cookie 	= require('cookie');

var authorizationMiddleware = function (socket, next)
{
	return next(null, true);

/*
	var handshakeData = socket.request;

	if (handshakeData.headers.cookie)
	{
		handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

		if (handshakeData.cookie['express.sid'] != undefined)
		{
			handshakeData.sessionID = cookieParser.signedCookie(handshakeData.cookie['express.sid'], 'secret');

			if (handshakeData.cookie['express.sid'] == handshakeData.sessionID)
			{
				return next('Cookie is invalid', false);
			}

			sessionStore.get(handshakeData.sessionID, function( err, session )
			{
				if (err || !session)
				{
					FormideOS.manager('debug').log('socket session not found');
					return next('Session not found', false);
				}
				else if (!session.passport || !session.passport.user || !session.permissions)
				{
					FormideOS.manager('debug').log('socket session not active');
					return next('Session not active', false);
				}
				else
				{
					FormideOS.manager('debug').log('socket auth successful');
					socket.session = session;
					return next(null, true);
				}
			});
		}
		else
		{
			return next('No cookie found', false);
		}
	}
	else
	{
		return next('No cookie found', false);
	}
*/
};

module.exports = authorizationMiddleware;