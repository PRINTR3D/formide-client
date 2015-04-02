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

var passwordHash = require('password-hash');

module.exports = {

	init: function( db, sequelize )
	{
		sequelize
		.sync({
			force: true
		})
		.complete(function(err)
		{
			if(err)
			{
				FormideOS.manager('debug').log(err, true);
			}
			else
			{
				db.User
				.create({
					"username": "login@printspot.local",
					"password": passwordHash.generate("password"),
					"permissions": "camera,files,led,log,printer,rest:material,rest:modelfile,rest:printer,rest:printjob,rest:queue,rest:sliceprofile,rest:user,slicer,wifi,device"
				})
				.success(function(success)
				{
					FormideOS.manager('debug').log('Database entry created: ' + success);
				});

				db.Accesstoken
				.create({
					"token": "b518e7f9-9d7f-4de8-a522-68deaea20024",
					"permissions": "camera,files,led,log,printer,rest:material,rest:modelfile,rest:printer,rest:printjob,rest:queue,rest:sliceprofile,rest:user,slicer,wifi,device"
				})
				.success(function(success)
				{
					FormideOS.manager('debug').log('Database entry created: ' + success);
				});

				db.Printer
				.create({
					"name": "Mini Builder",
					"buildVolumeX": 200,
					"buildVolumeY": 200,
					"buildVolumeZ": 200,
					"bed": false,
					"port": "/dev/tty1",
					"extruders": JSON.stringify([
					{
						"id": 0,
						"name": "extruder1",
						"nozzleSize": 400
					}])
				})
				.success(function(success)
				{
					FormideOS.manager('debug').log('Database entry created: ' + success);
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
					FormideOS.manager('debug').log('Database entry created: ' + success);
				});

				db.Sliceprofile
				.create({
					"name": "Default",
					"settings": JSON.stringify(
					{
						"slicerConfig": "marlinDualExtrusion",
						"fan": {
						   "fullspeedLayer": 10,
						   "min": 35,
						   "max": 90
						},
						"infill": {
						   "amount": 10,
						   "pattern": "grid",
						   "overlap": 15
						},
						"support": {
						   "fillRate": 15,
						   "angle": 30,
						   "supportEverywhere": 1,
						   "supportPlatform": 0,
						   "extruder": "extruder1",
						   "XYDistance": 700,
						   "ZDistance": 150
						},
						"skirt": {
						   "lineCount": 0,
						   "distance": 3000,
						   "minLenght": 150000
						},
						"multiExtrusion": {
							"preSwitchCode": [],
							"postSwitchCode": [],
							"dualOverlap": 1500
						},
						"movement": {
						   "combing": 0,
						   "oozeShield": 0,
						   "printSpeed": 40,
						   "travelSpeed": 40,
						   "innerWallSpeed": 15,
						   "outerWallSpeed": 15,
						   "infillSpeed": 35,
						   "speedupLayers": 10,
						   "firstLayersWidthFactor": 120,
						   "wipeTowerSize": 0
						},
						"raft": {
			               "baseThickness": 0,
			               "baseSpeed": 90,
			               "baseLineSpacing":1500,
			               "interfaceThickness": 0,
			               "interfaceLineWidth":400,
			               "interfaceLineSpacing": 5000,
			               "airGap": 200,
			               "baseLineWidth": 1000,
			               "extraMargin": 2000,
			               "surfaceLayers": 4,
			               "surfaceThickness": 0,
			               "surfaceSpeed": 20,
			               "surfaceLineWidth": 400,
			               "surfaceLineSpacing": 5000,
			               "firstLayerAirGap": 250,
			               "fanSpeed": 25,
						   "extruder":"extruder1"
			           	},
						"bottom": {
						   "thickness": 960,
						   "layerHeight": 240,
						   "speed": 15,
						   "solid": 1,
						   "layerDelay": 5,
						   "cutOff": 0
						},
						"top": {
						   "thickness": 720,
						   "solid": 1,
						   "layerHeight": 240
						},
						"retraction": {
						   "amount": 4500,
						   "speed": 45,
						   "extruderSwitch": 14500,
						   "minimalExtrusionBeforeRetraction": 20,
						   "zhop": 0,
						   "minimalDistance": 1500,
						},
						"layers": {
						   "spiralize": 0,
						   "simpleMode": 0,
						   "layerHeight": 200,
						   "layerCoolingTime": 2,
						   "firstLayersCount": 1,
						   "firstLayersAmount": 100,
						   "thickness": 200,
						   "wallThickness": 400
						},
						"extra": {
							"brimLines": 0
						},
						"gcode": {
						   "startGcode": ["G21", "G28", "G1 Z5 F5000", "G90", "G92 E0", "M82", "G92 E0"],
						   "endGcode": ["G92 E0", "M104 S0", "G28 X0", "M84"],
						   "changelayerGcode": [],
						   "gcodeFlavour": "GCODE_FLAVOR_ULTIGCODE"
						},
						"plugins": []
					})
				})
				.success(function(success)
				{
					FormideOS.manager('debug').log('Database entry created: ' + success);
				});
			}
		});
	}
}