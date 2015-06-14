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

var permissionsMiddleware = function (socket, next)
{
	_.each( socket.server.nsps, function( nsp )
	{
		nsp.once('connection', function( s )
		{
			if (!socket.session)
			{
				socket.disconnect();
			}
			else
			{
				if( nsp.name != '/')
				{
					if( socket.session.permissions.indexOf( nsp.name.replace('/', '') ) === -1 )
					{
						FormideOS.manager('debug').log('Socket permissions incorrect');
						s.disconnect();
					}
					else
					{
						FormideOS.manager('debug').log('Socket permissions correct');
					}
				}
			}
		});
	});

	next(null, true);
};

module.exports = permissionsMiddleware;