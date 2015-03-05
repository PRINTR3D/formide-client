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

	startAP: function()
	{
		// start access point
	},

	stopAP: function()
	{
		// stop access point
	},

	connectToWifi: function( ssid, password, callback )
	{
		callback( 'OK' );
	},

	registerToCloud: function( ssid, password, token, callback )
	{
		// connect to wifi, otherwise, back to AP

		var formide = require('formide')({
			apiUrl: 'http://formide.local',
			apiKey: 'FORMIDE',
			apiSecret: 'FORMIDESECRET',
			redirectURI: 'http://localhost:8080/auth/redirect',
			scope: 'user.user'
		});

		formide.apiproxy.call('POST', '/cauth/v1/token', {
			ip_int: '',
			ip_ext: '',
			mac: Printspot.macAddress,
			hostname: '',
			token: token
		}, function( success )
		{
			callback( success );
		}.bind(this));
	},

	listNetworks: function( callback )
	{
		networks = [
			{
				"ssid": "Printhom",
				"security": "WPA2",
				"signal": 70
			},
			{
				"ssid": "MyWifiNetwork",
				"security": "WPA",
				"signal": 65
			}
		];
		callback( networks );
	}
}