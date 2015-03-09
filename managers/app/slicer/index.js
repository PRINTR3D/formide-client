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
	slicer: {},

	init: function(config)
	{
		if(config.simulated)
		{
			this.process = spawn('node', ['index.js'], {cwd: FormideOS.appRoot + 'slicer-simulator', stdio: 'pipe'});
			this.process.stdout.setEncoding('utf8');
			this.process.stdout.on('exit', this.onExit);
			this.process.stdout.on('error', this.onError);
			this.process.stdout.on('data', this.onData);
		}

		setTimeout(function()
		{
			this.slicer = net.connect({
				port: config.port
			}, function() {
				FormideOS.manager('debug').log('slicer connected');
			});

			this.slicer.on('error', this.slicerError);
			this.slicer.on('data', this.sliceResponse);

		}.bind(this), 2500);

		FormideOS.manager('core.events').on('slicer.slice', this.slice);
		FormideOS.manager('core.events').on('process.exit', this.stop);
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
	slice: function(sliceData)
	{
		this.slicer.write(JSON.stringify(sliceData));
	},

	sliceResponse: function(responseData)
	{
		try // try parsing
		{
			data = JSON.parse(responseData.toString()); // convert binary stream to json object

			if(data.status == 200 && data.data.responseID != null)
			{
				FormideOS.manager('core.db').db.Printjob
				.find({where: {sliceResponse: "{" + data.data.responseID + "}"}})
				.success(function(printjob)
				{
					printjob
					.updateAttributes({gcode: data.data.gcode, sliceResponse: JSON.stringify(data.data)})
					.success(function()
					{
						FormideOS.manager('core.events').emit('log.message', {
							message: 'Slicing finished'
						});

						FormideOS.manager('core.events').emit('slicer.finished', {
							message: 'Slicing finished'
						});
					});
				});
			}
		}
		catch(e)
		{
			FormideOS.manager('debug').log(e, true);
		}
	},

	slicerError: function(error)
	{
		FormideOS.manager('debug').log(error, true);
	}
}