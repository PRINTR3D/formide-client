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
	slice: function(sliceparams, modelfile, sliceprofile, materials, printer, callback)
	{
		var self = this;
		var hash = (Math.random() / +new Date()).toString(36).replace(/[^a-z]+/g, '');

		FormideOS.manager('app.log').log( 'debug', sliceparams );

		var sliceData = {
			"type": "slice",
			"data": sliceparams
		};

		FormideOS.manager('core.db').db.Modelfile
		.find({ where: {id: modelfile} })
		then(function(dbModelfile)
		{
			// TODO: still hardcoded to 10 by 10 cm and with extruder 1
			var model = {
				"hash": dbModelfile.hash,
				"bucketIn": FormideOS.appRoot + FormideOS.config.get('paths.modelfile'),
				"x": 100000,
				"y": 100000,
				"z": 0,
				"extruder": "extruder1",
				"settings": "0"
			};

			sliceData.data.model = [model];
			sliceData.data.bucketOut = FormideOS.appRoot + FormideOS.config.get('paths.gcode');
			sliceData.data.responseID = hash;

			FormideOS.manager('core.db').db.Printjob
			.create(
			{
				ModelfileId: 	modelfile,
				printerID: 		printer,
				sliceprofileID: sliceprofile,
				materials: 		JSON.stringify( materials ),
				sliceResponse: 	"{" + hash + "}",
				sliceParams: 	JSON.stringify( sliceparams ),
				sliceMethod: 	'local'
			})
			.success(function(printjob)
			{
				// send slice request to local slicer
				self.slicer.write(JSON.stringify(sliceData), function() {
					FormideOS.manager('core.events').emit('slicer.slice', sliceData);
					return callback(true);
				});
			});
		});
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