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

var io 		= require('socket.io');
var cookie 	= require('cookie');

module.exports =
{
	connection: {},

	init: function()
	{
		this.connection = io.listen( FormideOS.manager('core.http').server.server );

		this.connection.set('authorization', function( handshakeData, accept )
		{
			if( handshakeData.headers.cookie )
			{
				handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
				handshakeData.sessionID = cookieParser.signedCookie(handshakeData.cookie['express.sid'], 'secret');

				if (handshakeData.cookie['express.sid'] == handshakeData.sessionID)
				{
					return accept('Cookie is invalid', false);
    			}
			}
			else
			{
				return accept('No cookie transmitted', false);
			}

			return accept(null, true);
		});

		FormideOS.manager('debug').log('websocket api running on port ' + FormideOS.config.get('app.websocket') );
	}
}