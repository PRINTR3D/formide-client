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

module.exports = function(routes, module)
{
	routes.get('/', function( req, res )
	{
		res.send( module.listenerTree );
	});

	routes.get('/:event/listeners', function( req, res )
	{
		res.send( module.listeners( req.params.event ) );
	});

	routes.get('/:trigger/trigger', function( req, res )
	{
		module.emit( req.params.trigger, req.query );
		res.send({
			status: 200,
			message: 'OK'
		});
	});
}