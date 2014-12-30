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

module.exports = function(config)
{
	var slicer = {};

	// setup tcp connection and log to logger
	slicer = net.connect({
		port: config.port
	}, function() {
		// emit slicer connection success to global eventbus
		global.Printspot.eventbus.emit('internalSuccess', {
			type: 'slicer',
			data: {
				port: config.port
			}
		});
	});

	slicer.on('error', function(error)
	{
		// emit slicer connection error to global eventbus
		global.Printspot.eventbus.emit('internalError', {
			type: 'slicer',
			data: error
		});
	});

	slicer.on('data', function(data)
	{
		try // try parsing
		{
			data = JSON.parse(data.toString()); // convert binary stream to json object

			if(data.status == 200 && data.data.responseID != null)
			{
				global.Printspot.db.Printjob
				.find({where: {sliceResponse: data.data.responseID}})
				.success(function(printjob)
				{
					printjob
					.updateAttributes({gcode: data.data.gcode, sliceResponse: JSON.stringify(data.data)})
					.success(function()
					{
						global.Printspot.db.Queueitem
						.create({
							origin: 'local',
							status: 'queued',
							gcode: printjob.gcode,
							PrintjobId: printjob.id
						})
						.success(function(queueitem) {
							// emit slice finished notification to global eventbus
							global.Printspot.eventbus.emit('notification', {
								type: 'slicer',
								data: {
									message: 'Slicing finished'
								}
							});
						})
					});
				});
			}
		}
		catch(e)
		{
			// todo
		}
	});

	global.Printspot.eventbus.on('slice', function(slice)
	{
		console.log(slice);
		slicer.write(JSON.stringify(slice));
	});

	return slicer;
};