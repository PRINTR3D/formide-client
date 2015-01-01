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

// Handles communication with online socketserver and dashboards
module.exports = function(config)
{
	var cloud = {};

	cloud = require('socket.io-client')(config.url);

	cloud.on('connect', function()
	{

	});

	cloud.on('handshake', function(handshake)
	{
		cloud.emit('typeof', {
			type: 'client',
			mac: Printspot.macAddress
		});
	});

	cloud.on('auth', function(auth)
	{
		if(auth.message == 'OK')
		{
			Printspot.eventbus.emit('internalSuccess', {
				type: 'cloud',
				data: {
					url: config.url
				}
			});
		}
		else
		{
			// todo
		}
	});

	// send online printjob to client
	/*
global.comm.online.on('dashboard_push_printer_printjob', function(data)
	{
		if(data.printerID == macAddress)
		{
			var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');
			var newPath = __dirname + '/' + global.config.get('paths.gcode') + '/' + hash;

			fs.writeFile(newPath, data.gcode, function(err)
			{
				if(err)
				{
					global.log('error', err, {'path': newPath});
				}
				else
				{
					global.db.Queueitem.create({
						slicedata: data.slicesettings,
						origin: 'online',
						gcode: hash,
						printjobID: data.id,
						status: "queued"
					});
				}
			});
		}
	});
*/

	Printspot.config.get('channels.dashboard').forEach(function(method)
	{
		(function(realMethod)
		{
			cloud.on(realMethod, function(data)
			{
				// check if incoming message is really meant for this printer
				if(data.printerID == Printspot.macAddress)
				{
					var json = {
						"type": realMethod,
						"data": data
					};

					Printspot.eventbus.emit('cloudPush', json);
				}
			});
		})(method);
	});

	Printspot.eventbus.on('printerStatus', function(status)
	{
		status.data.printerID = Printspot.macAddress;
		cloud.emit(status.type, status.data);
	});

	Printspot.eventbus.on('notification', function(notification)
	{
		cloud.emit('client_push_notification', notification.message);
	});

	return cloud;
};