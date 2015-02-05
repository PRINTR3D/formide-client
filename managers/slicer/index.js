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
		fs.exists(config.path, function(exists)
		{
			if(exists && config.simulated == false)
			{
				this.process = spawn('./katana', [], {cwd: config.path + '/Debug', stdio: 'pipe'});
				this.process.stdout.setEncoding('utf8');
				this.process.stdout.on('exit', this.onExit);
				this.process.stdout.on('error', this.onError);
				this.process.stdout.on('data', this.onData);
			}
			else
			{
				this.process = spawn('node', ['index.js'], {cwd: 'slicer-simulator', stdio: 'pipe'});
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
					Printspot.debug('slicer connected');
				});

				this.slicer.on('error', this.slicerError);
				this.slicer.on('data', this.sliceResponse);

			}.bind(this), 500);

		}.bind(this));
	},

	on:
	{
		'slice': 'slice',
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
				Printspot.db.Printjob
				.find({where: {sliceResponse: data.data.responseID}})
				.success(function(printjob)
				{
					printjob
					.updateAttributes({gcode: data.data.gcode, sliceResponse: JSON.stringify(data.data)})
					.success(function()
					{
						Printspot.db.Queueitem
						.create({
							origin: 'local',
							status: 'queued',
							gcode: printjob.gcode,
							PrintjobId: printjob.id
						})
						.success(function(queueitem)
						{
							Printspot.events.emit('externalMessage', {
								message: 'Slicing finished'
							});
						})
					});
				});
			}
		}
		catch(e)
		{
			Printspot.debug(e, true);
		}
	},

	slicerError: function(error)
	{
		Printspot.debug(error, true);
	}
}