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

module.exports = {

	network: {},
	cloud: {},

	init: function()
	{
		this.startAP();

		Printspot.websocket.on('connection', function(socket)
		{
			socket.on('setup_wifi', function( network )
			{
				this.network = network;
			}.bind(this));

			socket.on('setup_cloud', function( cloud )
			{
				this.cloud = cloud;
			}.bind(this));

			socket.on('setup_run', function()
			{
				this.stopAP();
				this.connectToWifi(function( err )
				{
					if( err )
					{
						this.startAP();
					}
					else
					{
						this.registerToCloud(function()
						{

						});
					}
				}.bind(this));
			}.bind(this));

		}.bind(this));
	},

	startAP: function()
	{

		// start access point
	},

	stopAP: function()
	{

	},

	connectToWifi: function( callback )
	{
		callback( 'OK' );
		// connect to wifi
	},

	registerToCloud: function( callback )
	{
		callback( 'OK' );
		// register on formide api
	}
}


/*

1) Send out AP
2) Receive formide credentials and WiFi credentials
3) Connect with Wifi
	1) On success: register device in cloud and pass along local IP
	2) On fail: go back to AP mode
4)


*/