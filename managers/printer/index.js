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
	process2: null,
	printer: {},

	init: function(config)
	{
		fs.exists(config.path, function(exists)
		{
			if(exists && config.simulated == false)
			{
				this.process1 = spawn('./ClientDriver', [], {cwd: config.path, stdio: 'pipe'});
				this.process1.stdout.setEncoding('utf8');
				this.process1.stdout.on('exit', this.onExit);
				this.process1.stdout.on('error', this.onError);
				this.process1.stdout.on('data', this.onData);

				this.process2 = spawn('./formideOS', [], {cwd: config.path, stdio: 'pipe'});
				this.process2.stdout.setEncoding('utf8');
				this.process2.stdout.on('exit', this.onExit);
				this.process2.stdout.on('error', this.onError);
				this.process2.stdout.on('data', this.onData);
			}
			else
			{
				this.process1 = spawn('node', ['index.js'], {cwd: 'driver-simulator', stdio: 'pipe'});
				this.process1.stdout.setEncoding('utf8');
				this.process1.stdout.on('exit', this.onExit);
				this.process1.stdout.on('error', this.onError);
				this.process1.stdout.on('data', this.onData);
			}

			setTimeout(function()
			{
				this.printer = net.connect({
					port: config.port
				}, function() {
					Printspot.debug('printer connected');
				});

				this.printer.on('error', this.printerError);
				this.printer.on('data', this.printerStatus);

			}.bind(this), 1500);

		}.bind(this));
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
		this.process2.kill('SIGINT');
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