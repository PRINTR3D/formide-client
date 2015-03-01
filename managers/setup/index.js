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

var os = require('os');

module.exports = {

	network: {},

	init: function()
	{
		this.registerToCloud('chris@printr.nl', 'password', function( response )
		{

		});


/*
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

			socket.on('get_networks', this.listNetworks);

		}.bind(this));
*/
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

	registerToCloud: function( username, password, callback )
	{
		var formide = require('formide')({
			apiUrl: 'http://localhost:8000',
			apiKey: 'FORMIDE',
			apiSecret: 'FORMIDESECRET',
			redirectURI: 'http://localhost:8080/auth/redirect',
			scope: 'user.user'
		});

		formide.auth.login(username, password, function( session )
		{
			formide.apiproxy.call('POST', '/cauth/v1/register', {
				ip_int: '',
				ip_ext: '',
				mac: ''
			}, function( success )
			{
				console.log(success);
				// get client session
			});
		});
	},

	listNetworks: function( callback )
	{

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