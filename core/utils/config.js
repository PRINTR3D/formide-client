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

module.exports = function()
{
	var env = process.env.NODE_ENV || 'development';
	var cfg = require('../../config/' + env + '.json');

	function parts(key)
	{
		if (Array.isArray(key)) return key
		return key.split('.')
	}

	var config = {

		get: function(key) {
			var obj = cfg;
			key = parts(key);
			for (var i = 0, l = key.length; i < l; i++)
			{
				var part = key[i];
				if( !(part in obj) )
				{
					return null;
				}
				obj = obj[part];
  			}
  			return obj;
		},
		
		set: function(key, value) {
			cfg[key] = value;
			return this;
		},

		environment: env
	};

	return config;
}