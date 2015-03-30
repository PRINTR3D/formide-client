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

var JsonStorage 	= require('jsonstorage');

module.exports =
{
	db: {},

	init: function (config)
	{
		this.db = new JsonStorage(config.folder);

		if(FormideOS.manager('core.process').args.setup)
		{
			FormideOS.manager('debug').log('Storage setup running');
			require('./setup.js').init( this.db );
		}
	}
}