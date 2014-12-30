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
	var printer = {};

	// setup tcp connection and log to logger
	printer = net.connect({
		port: config.port
	}, function() {
		// emit printer connection success to global eventbus
		global.Printspot.eventbus.emit('internalSuccess', {
			type: 'printer',
			data: {
				port: config.port
			}
		});
	});

	printer.on('error', function(error)
	{
		// emit printer connection error to global eventbus
		global.Printspot.eventbus.emit('internalError', {
			type: 'printer',
			data: error
		});
	});

	printer.on('data', function(data)
	{
		try // try parsing
		{
			data = JSON.parse(data.toString());
			global.Printspot.eventbus.emit('printerStatus', data);

			if(data.type == 'client_push_printer_finished')
			{
				global.Printspot.db.Queueitem
				.find({where: {id: data.data.printjobID}})
				.success(function(queueitem)
				{
					queueitem
					.updateAttributes({status: 'finished'})
					.success(function()
					{
						// todo
					});
				});
			}
		}
		catch(e)
		{
			// todo
		}
	});

	global.Printspot.eventbus.on('cloudPush', function(data)
	{
		printer.write(JSON.stringify(data));
	});

	global.Printspot.eventbus.on('dashboardPush', function(data)
	{
		printer.write(JSON.stringify(data));
	});

	return printer;
};