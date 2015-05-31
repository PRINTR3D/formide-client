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

	init: function(db) {
		
		db.User.create({
			password: "derp",
			email: "derp@printr.nl",
			firstname: "Chris",
			lastname: "ter Beke"
		});
		
		db.Printer.create({
			name: "MyCyrus",
			buildVolume: {
				x: 200,
				y: 200,
				z: 200
			},
			bed: false,
			extruders: [
				{
					id: 0,
					name: "extruder1",
					nozzleSize: 400
				}
			],
			port: "/dev/tty1"
		});
		
		db.AccessToken.create({
			token: "b518e7f9-9d7f-4de8-a522-68deaea20024",
			permissions: [
				"auth",
				"camera",
				"files",
				"led",
				"log",
				"printer",
				"rest:material",
				"rest:modelfile",
				"rest:printer",
				"rest:printjob",
				"rest:queue",
				"rest:sliceprofile",
				"rest:user",
				"slicer",
				"wifi",
				"device"
			]
		});
		
		db.Material.create({
			name: "PLA",
			type: "PLA",
			temperature: 200,
			firstLayersTemperature: 210,
			bedTemperature: 50,
			firstLayersBedTemperature: 60,
			filamentDiameter: 1750,
			feedrate: 100
		});
		
		db.Sliceprofile.create({
			name: "default",
			settings: {
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
				   "supportEverywhere": 0,
				   "supportPlatform": 0,
				   "extruder": "extruder1",
				   "XYDistance": 700,
				   "ZDistance": 150
				},
				"skirt": {
				   "lineCount": 1,
				   "distance": 10000,
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
				   "thickness": 600,
				   "layerHeight": 300,
				   "speed": 15,
				   "solid": 1,
				   "layerDelay": 0,
				   "cutOff": 0
				},
				"top": {
				   "thickness": 500,
				   "solid": 1,
				   "layerHeight": 250
				},
				"retraction": {
				   "amount": 3000,
				   "speed": 30,
				   "extruderSwitch": 14500,
				   "minimalExtrusionBeforeRetraction": 20,
				   "zhop": 0,
				   "minimalDistance": 1500,
				},
				"layers": {
				   "spiralize": 0,
				   "simpleMode": 0,
				   "layerHeight": 200,
				   "layerCoolingTime": 0,
				   "firstLayersCount": 0,
				   "firstLayersAmount": 100,
				   "thickness": 200,
				   "wallThickness": 800
				},
				"extra": {
					"brimLines": 0
				},
				"gcode": {
				   "startGcode": ["G21", "G28", "G1 Z5 F5000", "G90", "G92 E0", "M82", "G92 E0"],
				   "endGcode": ["G92 E0", "M104 S0", "G28 X0", "M84"],
				   "changelayerGcode": [],
				   "gcodeFlavour": "GCODE_FLAVOR_DEFAULT"
				}
			}
		});
	}
}