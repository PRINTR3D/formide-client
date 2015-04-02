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

// dependencies
var net 		= require('net');
var request 	= require('request');
var socket 		= require('socket.io-client');

module.exports =
{
	cloud: {},
	clients: [],

	init: function( config )
	{
		this.cloud = socket( config.url )

		this.cloud.on('connect', function() {

		}.bind(this));

		this.cloud.on('http', function(data, callback) {
			FormideOS.manager('debug').log('Cloud http call: ' + data.url);
			this.http(data, function(response) {
				callback(response);
			});
		}.bind(this));
	},

	http: function( data, callback )
	{
		request({
			method: data.method,
			uri: 'http://127.0.0.1:' + FormideOS.manager('core.http').server.server.address().port + '/api' + data.url,
			auth: {
				bearer: data.token
			},
			form: data.data || {}
		}, function( error, response, body )
		{
			callback( body );
		});
	},

	socketOn: function( data )
	{

	},

	socketEmit: function( data )
	{
		this.cloud.emit()
	}
}