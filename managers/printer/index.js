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
var spawn = require('child_process').spawn;
var fs = require('fs');
var net = require('net');

module.exports =
{
	process1: null,
	printer: {},

	init: function(config)
	{
		if(config.simulated)
		{
			this.process1 = spawn('node', ['index.js'], {cwd: 'driver-simulator', stdio: 'pipe'});
			this.process1.stdout.setEncoding('utf8');
			this.process1.stdout.on('exit', this.onExit);
			this.process1.stdout.on('error', this.onError);
			this.process1.stdout.on('data', this.onData);
		}

		setTimeout(function()
		{
			this.printer = new net.Socket();

			this.printer.connect({
				port: config.port
			}, function() {
				Printspot.debug('printer connected');
			});

			this.printer.on('error', this.printerError);
			this.printer.on('data', this.printerStatus);

		}.bind(this), 2500);
	},

	on:
	{
		'cloudPush': 'printerControl',
		'dashboardPush': 'printerControl',
		'scheduledPrintjob': 'printerControl',
		'processExit': 'stop'
	},

	onExit: function(exit)
	{
		Printspot.debug(exit, true);
	},

	onError: function(error)
	{
		Printspot.debug(error, true);
	},

	onData: function(data)
	{
		Printspot.debug(data);
	},

	stop: function(stop)
	{
		this.process1.kill('SIGINT');
	},

	// custom functions
	printerError: function(error)
	{
		Printspot.debug(error.toString(), true);
	},

	printerStatus: function(printerData)
	{
		try // try parsing
		{
			data = JSON.parse(printerData.toString());
			Printspot.events.emit('printerStatus', data);

			if(data.type == 'status')
			{
				this.status = data.data;
			}

			if(data.type == 'finished')
			{
				Printspot.db.Queueitem
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
			Printspot.debug(e.toString(), true);
		}
	},

	printerControl: function(data)
	{
		this.printer.write(JSON.stringify(data));
	}
}