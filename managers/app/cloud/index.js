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
	local: [],

	init: function( config )
	{
		this.cloud = socket( config.url );

		this.cloud.on('connect', function() {
			this.cloud.emit('authenticate', {
				mac: FormideOS.macAddress,
				token: FormideOS.settings.cloud.accesstoken,
				permissions: FormideOS.settings.cloud.permissions
			});
			FormideOS.manager('debug').log('Cloud connected');
		}.bind(this));

		this.cloud.on('http', function(data, callback) {
			FormideOS.manager('debug').log('Cloud http call: ' + data.manager + '/' + data.function);
			this.http(data, function(response) {
				callback(response);
			});
		}.bind(this));

		this.cloud.on('listen', function(data, callback) {
			FormideOS.manager('debug').log('Cloud ws listen: ' + data.manager + '/' + data.channel);
			this.listen(data, function(response) {
				callback(response);
			});
		}.bind(this));

		this.cloud.on('emit', function(data, callback) {
			FormideOS.manager('debug').log('Cloud ws emit: ' + data.manager + '/' + data.channel);
			this.emit(data);
		}.bind(this));

		this.cloud.on('disconnect', function() {
			FormideOS.manager('debug').log('Cloud diconnected');
		});
	},

	http: function(data, callback) {
		request({
			method: data.method,
			uri: 'http://127.0.0.1:' + FormideOS.manager('core.http').server.server.address().port + '/api/' + data.manager + '/' + data.function,
			auth: {
				bearer: data.token
			},
			form: data.data || {}
		}, function( error, response, body ) {
			callback( body );
		});
	},

	listen: function(data, callback) {
		var self = this;
		if(!this.local[data.manager]) {
			this.local[data.manager] = socket( 'ws://127.0.0.1:' + FormideOS.manager('core.http').server.server.address().port + '/' + data.manager);
		}
		this.local[data.manager].on(data.channel, function(response) {
			self.cloud.emit(data.manager + "." + data.channel, response);
		});
	},

	emit: function(data) {
		var self = this;
		if(!this.local[data.manager]) {
			this.local[data.manager] = socket( 'ws://127.0.0.1:' + FormideOS.manager('core.http').server.server.address().port + '/' + data.manager);
		}
		this.local[data.manager].emit(data.channel, data.data);
	}
}