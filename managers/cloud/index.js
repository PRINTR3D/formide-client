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
var net = require('net');

module.exports =
{
	cloud: {},

	init: function(config)
	{
		this.cloud = require('socket.io-client')(config.url);

		this.cloud.on('handshake', this.handshake);

		this.cloud.on('auth', this.auth);

		this.cloud.on('dashboard_push_printer_printjob', this.pushPrintjob);

		this.cloud.on('error', this.onError);

		this.cloud.on('connect_failed', this.onError);

		this.cloud.on('disconnect', this.onError);

		this.cloud.on('reconnect_error', this.onError);

		this.cloud.on('updates', this.sendUpdates);

		this.loadChannels();
	},

	on:
	{
		'printerStatus': 'printerStatus',
		'externalMessage': 'notification',
		'checkForUpdates': 'checkForUpdates'
	},

	// custom functions
	onError: function(error)
	{
		Printspot.debug(error, true);
	},

	handshake: function(handshake)
	{
		this.emit('typeof', {
			type: 'client',
			mac: Printspot.macAddress
		});
	},

	auth: function(auth)
	{
		if(auth.message == 'OK')
		{
			Printspot.debug('Cloud connected');
		}
		else
		{
			Printspot.debug(auth, true);
		}
	},

	loadChannels: function()
	{
		var _this = this;

		// TODO: rewrite
		Printspot.config.get('channels.dashboard').forEach(function(method)
		{
			(function(realMethod)
			{
				_this.cloud.on(realMethod, function(data)
				{
					// check if incoming message is really meant for this printer
					if(data.printerID == Printspot.macAddress)
					{
						var json = {
							"type": realMethod,
							"data": data
						};

						Printspot.events.emit('cloudPush', json);
					}
				});
			})(method);
		});
	},

	pushPrintjob: function(printjob)
	{
		if(printjob.printerID == macAddress)
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = __dirname + '/' + global.config.get('paths.gcode') + '/' + hash;

			fs.writeFile(newPath, printjob.gcode, function(err)
			{
				if(err)
				{
					Printspot.debug(err, true);
				}
				else
				{
					global.db.Queueitem.create({
						slicedata: printjob.slicesettings,
						origin: 'online',
						gcode: hash,
						printjobID: printjob.id,
						status: "queued"
					});
				}
			});
		}
	},

	printerStatus: function(status)
	{
		status.data.printerID = Printspot.macAddress;
		this.cloud.emit(status.type, status.data);
	},

	notification: function(message)
	{
		this.cloud.emit('client_push_notification', message.message);
	},

	checkForUpdates: function()
	{
		this.cloud.emit('client_push_updates');
	},

	sendUpdates: function(updates)
	{
		Printspot.events.emit('newUpdates', updates);
	}
}