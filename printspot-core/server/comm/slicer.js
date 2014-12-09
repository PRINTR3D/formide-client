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

var net = require('net');

// tcp connection to the local slicer (katana  light)
global.comm.slicer = net.connect({port: global.config.get('slicer.port')}, function()
{
	global.log('info', 'katana connected', {port: global.config.get('slicer.port')});
});

// when slicer produces error, log this
global.comm.slicer.on('error',function(err)
{
	console.error('error connecting to katana on port', global.config.get('slicer.port'));
	throw err;
});

// when slicer returns slice data, save this in database
global.comm.slicer.on('data', function(data)
{
	data = JSON.parse(data.toString());
	if(data.status == 200 && data.data.responseID != null)
	{
		global.db.Printjob.find({where: {sliceResponse: data.data.responseID}}).success(function(printjob)
		{
			printjob.updateAttributes({gcode: data.data.gcode, sliceResponse: JSON.stringify(data.data)}, ['gcode']).success(function()
			{
				global.db.Queueitem.create({
					origin: 'local',
					printjobID: printjob.id,
					status: 'queued',
					gcode: data.data.gcode
				});
				global.comm.local.sockets.emit('client_push_notification', 'Done slicing');
				//global.comm.online.sockets.emit('client_push_notification', 'Done slicing');
			});
		});
	}
	else
	{
		global.comm.local.sockets.emit('client_push_notification', 'Slicing failed. Please try again');
		console.error(data);
	}
});