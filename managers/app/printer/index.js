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
	process: null,
	printer: {},

	init: function(config)
	{
		if(config.simulated)
		{
			this.process = spawn('node', ['index.js'], {cwd: FormideOS.appRoot + 'driver-simulator', stdio: 'pipe'});
			this.process.stdout.setEncoding('utf8');
			this.process.stdout.on('exit', this.onExit);
			this.process.stdout.on('error', this.onError);
			this.process.stdout.on('data', this.onData);
		}

		setTimeout(function()
		{
			this.printer = new net.Socket();

			this.printer.connect({
				port: config.port
			}, function() {
				FormideOS.manager('debug').log('printer connected');
			});

			this.printer.setTimeout(10);
			this.printer.setNoDelay(true);
			this.printer.on('error', this.printerError);
			this.printer.on('data', this.printerStatus);

		}.bind(this), 2500);

		FormideOS.manager('core.events').on('interface.command', this.printerControl.bind(this));
		FormideOS.manager('core.events').on('process.exit', this.stop.bind(this));
	},

	onExit: function(exit)
	{
		FormideOS.manager('debug').log(exit, true);
	},

	onError: function(error)
	{
		FormideOS.manager('debug').log(error, true);
	},

	onData: function(data)
	{
		FormideOS.manager('debug').log(data);
	},

	stop: function(stop)
	{
		this.process.kill('SIGINT');
	},

	// custom functions
	printerError: function(error)
	{
		FormideOS.manager('debug').log(error.toString(), true);
	},

	printerStatus: function(printerData)
	{
		try // try parsing
		{
			data = JSON.parse(printerData.toString());
			FormideOS.manager('core.events').emit('printer.status', data);

			if(data.type == 'status')
			{
				this.status = data.data;
			}

			if(data.type == 'finished')
			{
				FormideOS.manager('core.db').db.Queueitem
				.find({where: {id: data.data.printjobID}})
				.success(function(queueitem)
				{
					if(queueitem != null)
					{
						queueitem
						.updateAttributes({status: 'finished'})
						.success(function()
						{
							FormideOS.manager('debug').log('removed item from queue after printing');
						});
					}
				});
			}
		}
		catch(e)
		{
			FormideOS.manager('debug').log(e.toString(), true);
		}
	},

	printerControl: function(data)
	{
		if( data.data == undefined || data.data == null)
		{
			data.data = {};
		}

		this.printer.write(JSON.stringify(data));
	}
}