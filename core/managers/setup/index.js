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

module.exports = {

	init: function()
	{
		// setup new db connection
		var database = Printspot.manager('database');
		var db = database.db;

		database.sequelize
		.sync({
			force: true
		})
		.complete(function(err)
		{
			if(err)
			{
				Printspot.debug(err, true);
			}
			else
			{
				db.User
				.create({
					"username": "login@printspot.local",
					"password": "password"
				})
				.success(function(success)
				{
					Printspot.debug('Database entry created: ' + success);
				});

				db.Printer
				.create({
					"name": "Big Builder",
					"buildVolumeX": 200,
					"buildVolumeY": 200,
					"buildVolumeZ": 600,
					"bed": true,
					"extruders": JSON.stringify([
					{
						"id":0,
						"name":"extruder1",
						"nozzleSize":30
					},
					{
						"id":1,
						"name":"extruder2",
						"nozzleSize":30
					}])
				})
				.success(function(success)
				{
					Printspot.debug('Database entry created: ' + success);
				});

				db.Printer
				.create({
					"name": "Mini Builder",
					"buildVolumeX": 200,
					"buildVolumeY": 200,
					"buildVolumeZ": 200,
					"bed": false,
					"extruders": JSON.stringify([
					{
						"id":0,
						"name":"extruder1",
						"nozzleSize": 300
					}])
				})
				.success(function(success)
				{
					Printspot.debug('Database entry created: ' + success);
				});

				db.Material
				.create({
					"name": "PLA",
					"type": "PLA",
					"temperature": 193,
					"firstLayersTemperature": 200,
					"bedTemperature": 50,
					"firstLayersBedTemperature": 60,
					"filamentDiameter": 1750,
					"feedrate": 100
				})
				.success(function(success)
				{
					Printspot.debug('Database entry created: ' + success);
				});

				db.Sliceprofile
				.create({
					"name": "Default",
					"settings": JSON.stringify(
					{
						"slicerConfig": "marlinDualExtrusion",
						"fan": {
							"fullspeedLayer": 10,
							"min": 25,
							"max": 90
						},
						"raft": {
							"baseThickness": 0,
							"baseSpeed": 20,
							"lineSpacing":3000,
							"interfaceThickness": 0,
							"interfaceLineWidth":400,
							"interfaceLineSpacing": 800,
							"airGap": 0,
							"baseLineWidth": 1000,
							"extraMargin": 5000,
							"surfaceLayers": 2,
							"surfaceThickness": 270,
							"surfaceSpeed": 0,
							"surfaceLineWidth": 400,
							"surfaceLineSpacing": 400,
							"firstLayerAirGap": 200,
							"fanSpeed": 25
						},
						"infill": {
							"sparseInfillLineDistance": 2000,
							"amount": 50,
							"pattern": "grid",
							"overlap": 15
						},
						"support": {
							"angle": 45,
							"supportModel": 1,
							"supportPlatform": 1,
							"extruder": -1,
							"XYDistance": 700,
							"lineDistance": 2000
						},
						"skirt": {
							"lineCount": 1,
							"distance": 3000,
							"minLenght": 150000
						},
						"dualExtrude": {
							"dualOverlap": 1500
						},
						"movement": {
							"combing": 0,
							"oozeShield": 0,
							"printSpeed": 40,
							"travelSpeed": 20,
							"insetXSpeed": 15,
							"inset0Speed": 15,
							"infillSpeed": 20,
							"speedupLayers": 10,
							"extrusionWidth": 200,
							"firstLayersExtrusionWidth": 300,
							"wipeTowerSize": 0
						},
						"bottom": {
							"thickness": 480,
							"speed": 50,
							"solid": 1,
							"layerDelay": 5,
							"cutOff": 0,
							"layerHeight": 240
						},
						"top": {
							"thickness": 480,
							"solid": 1,
							"layerHeight": 240
						},
						"retraction": {
							"minimalDistance": 100
	           			},
						"layers": {
							"spiralize": 0,
							"simpleMode": 0,
							"layerHeight": 200,
							"layerCoolingTime": 2,
							"firstLayersCount": 1,
							"firstLayersAmount": 100,
							"thickness": 200,
							"wallThickness": 200
						},
						"extra": {
							"brimLines": 0
						},
						"gcode": {
							"startGcode": ["G21", "M107", "M104 S195", "G28", "G1 Z5 F5000", "M109 S195", "G90", "G92 E0", "M82", "G1 F1800.000 E-1.00000", "G92 E0"],
							"endGcode": ["G92 E0", "M107", "M104 S0", "G28 X0", "M84"],
							"gcodeFlavour":"MACH3"
						},
						"plugins": []
					})
				})
				.success(function(success)
				{
					Printspot.debug('Database entry created: ' + success);
				});
			}
		});
	}
}