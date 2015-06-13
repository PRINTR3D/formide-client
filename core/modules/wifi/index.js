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

module.exports =
{
	name: "wifi",
	
	connection: {},

	init: function()
	{
		this.connection = new Wireless({
			iface: 'wlan0'
		});

		this.connection.enable(function( err )
		{
			this.connection.start();
		}.bind(this));
	},

	connect: function( SSID, passwd, callback )
	{
		this.connection.join( SSID, passwd, function( err )
		{
			callback( err );
			console.log( err );
		});
	}
}