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
var request = require('request');

module.exports = {

	name: "core.setup",
	
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

	registerToCloud: function( ssid, password, registertoken ) {
		// connect to wifi, otherwise, back to AP
		request({
			method: 'POST',
			//url: 'http://localhost:3000/clients/register/token',
			url: 'https://api2.formide.com/clients/register/token',
			form:{
				mac: FormideOS.macAddress,
				registertoken: registertoken
			},
			strictSSL: false
		}, function( err, httpResponse, body ) {
			if( err ) {
				FormideOS.manager('debug').log( err, true );
			}
			else {
				FormideOS.manager('debug').log( body );
				FormideOS.settings.cloud.accesstoken = JSON.parse(body).accessToken;
			}
		}.bind(this));
	},

	listNetworks: function( callback ) {
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