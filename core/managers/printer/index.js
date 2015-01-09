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
	printer: {},
	status: null,

	init: function(config)
	{
		this.printer = net.connect({
			port: config.port
		}, function() {
			Printspot.debug('printer connected');
		});

		this.printer.on('error', this.printerError);

		this.printer.on('data', this.printerStatus);
	},

	on:
	{
		'cloudPush': 'printerControl',
		'dashboardPush': 'printerControl',
		'scheduledPrintjob': 'printerControl'
	},

	// custom functions
	printerError: function(error)
	{
		Printspot.debug(error, true);
	},

	printerStatus: function(printerData)
	{
		try // try parsing
		{
			data = JSON.parse(printerData.toString());
			Printspot.events.emit('printerStatus', data);

			if(data.type == 'client_push_printer_status')
			{
				this.status = data.data.status;
			}

			if(data.type == 'client_push_printer_finished')
			{
				Printspot.manager('database').db.Queueitem
				.find({where: {id: data.data.printjobID}})
				.success(function(queueitem)
				{
					if(queueitem != null)
					{
						queueitem
						.updateAttributes({status: 'finished'})
						.success(function()
						{
							Printspot.debug('removed item from queue after printing');
						});
					}
				});
			}
		}
		catch(e)
		{
			Printspot.debug(e, true);
		}
	},

	printerControl: function(data)
	{
		this.printer.write(JSON.stringify(data));
	}
}