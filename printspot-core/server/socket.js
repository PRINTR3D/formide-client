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

var fs = require('fs');

module.exports = function(macAddress)
{
	var authorized = false;

	// online connection
	global.comm.online.on('connect', function()
	{

	});


	// receive handshake from socket server
	global.comm.online.on('handshake', function(data)
	{
		global.log('info', 'new online server connection', data);
		global.comm.online.emit('typeof',
		{
			type: 'client',
			mac: macAddress
		});
	});

	// receive auth from socket server
	global.comm.online.on('auth', function(data)
	{
		if(data.message == 'OK')
		{
			authorized = true;
		}
	});

	// steram error logging to socket server
	global.logger.on('logging', function (transport, level, msg, meta)
	{
    	global.comm.online.emit('client_push_log', {level: level, msg: msg, meta: meta, printerID: macAddress});
  	});

	// load channels from config
	global.config.get('channels.dashboard').forEach(function(method)
	{
		(function(realMethod)
		{
			global.comm.online.on(realMethod, function(data)
			{
				// check if incoming message is really meant for this printer
				if(data.printerID == macAddress)
				{
					var json = {
						"type": realMethod,
						"data": data
					};
					global.comm.client.write(JSON.stringify(json));
					global.log('debug', 'online server command ' + realMethod, data);
				}
			});
		})(method);
	});

	// send online printjob to client
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

	// push print start
	global.comm.online.on('dashboard_push_printer_start', function(data)
	{
		data.hash = __dirname + '/../../uploads/gcode/' + data.hash;
		var json = {
			"type": "dashboard_push_printer_start",
			"data": data
		};
		global.comm.client.write(JSON.stringify(json));
		global.log('debug', 'online dashboard command ' + "dashboard_push_printer_start", data);
	});

	// send local queue to online dashboard
	global.comm.online.on('dashboard_get_printer_queue', function(data)
	{
		if(data.printerID == macAddress)
		{
			global.db.Queueitem
			.findAll({where: {status: 'queued'}, include: [{model: global.db.Printjob, include: [{model: global.db.Modelfile}]}]})
			.success(function(queue)
			{
				global.comm.online.emit('client_push_printer_queue', {printerID: macAddress, data: queue});
			});
		}
	});

	// Receive client data and send to online dashboard
	global.comm.client.on('data', function(data)
	{
		if(authorized)
		{
			try
			{
				data = JSON.parse(data.toString());
				data.data.printerID = macAddress;
				global.comm.online.emit(data.type, data.data);
			}
			catch(e)
			{
				global.log(e);
			}
		}
	});



	// local connection
	global.comm.local.sockets.on('connection', function(socket)
	{
		socket.emit('handshake', {id:socket.id});

		// Authentication not really neccesery locally
		socket.on('typeof', function(data)
		{
			global.log('info', 'new local dashboard connection', data);
			if(data.type == 'dashboard')
			{
				socket.emit('auth', {message: 'OK', id: socket.id});
			}
		});

		// Socket disconnect
		socket.on('disconnect', function()
		{
			global.log('info', 'local dashboard disconnected', {});
		});

		// load channels from config
		global.config.get('channels.dashboard').forEach(function(method)
		{
			(function(realMethod)
			{
				socket.on(realMethod, function(data)
				{
					var json = {
						"type": realMethod,
						"data": data
					};

					global.comm.client.write(JSON.stringify(json));
					global.log('debug', 'local dashboard command ' + realMethod, data);
				});
			})(method);
		});

		// push print start
		socket.on('dashboard_push_printer_start', function(data)
		{
			data.hash = __dirname + '/../../uploads/gcode/' + data.hash;
			var json = {
				"type": "dashboard_push_printer_start",
				"data": data
			};
			global.comm.client.write(JSON.stringify(json));
			global.log('debug', 'local dashboard command ' + "dashboard_push_printer_start", data);
		});

		// receive driver data and send to local dashboard
		global.comm.client.on('data', function(data)
		{
			global.log('debug', 'qclient status pushed', data.toString());

			try
			{
				data = JSON.parse(data.toString());
				if(data.type == 'client_push_printer_finished')
				{
					global.db.Queueitem.find({where: {id: data.data.printjobID}}).success(function(queueitem)
					{
						queueitem.updateAttributes({status: 'finished'});
					});
				}

				socket.emit(data.type, data.data);
			}
			catch(e)
			{
				global.log(e);
			}
		});
	});
};