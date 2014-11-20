var Sequelize 	= require('sequelize');
var sequelize 	= new Sequelize('printspot', 'root', null, {
	dialect: "sqlite",
	storage: 'server/printspot.sqlite',
	define: {
		charset: 'utf8'
	}
});
var sqliteConfig = require('./../printspot-config/db.json');

for(var key in sqliteConfig) {
	(function(realKey) {
		global[realKey] = sequelize.define(realKey, sqliteConfig[realKey].fields);
	})(key);
}

sequelize
	.sync({
		force: true
	})
	.complete(function(err) {
		if(err) {
			console.log('An error occurred while creating the table: ', err)
		}
		else {
			for(var key in sqliteConfig) {
				(function(realKey) {
					for(var recordKey in sqliteConfig[realKey].records) {
						(function(realRecordKey) {
							global[realKey].create(sqliteConfig[realKey].records[realRecordKey]);
						})(recordKey);
					}
				})(key);
			}
			
			global.Printer.create({
				"name": "Big Builder",
				"buildVolumeX": 200,
				"buildVolumeY": 200,
				"buildVolumeZ": 600,
				"bed": true,
				"extruders": JSON.stringify([{"id":0,"name":"extruder1","nozzleSize":30},{"id":1,"name":"extruder2","nozzleSize":30}])
			});
			
			global.Printer.create({
				"name": "Mini Builder",
				"buildVolumeX": 200,
				"buildVolumeY": 200,
				"buildVolumeZ": 200,
				"bed": false,
				"extruders": JSON.stringify([{"id":0,"name":"extruder1","nozzleSize":30}])
			});
			
			global.Sliceprofile.create({
				"name": "Printr Default",
				"settings": JSON.stringify({"slicerConfig":"marlin","fan":{"fullspeedLayer":10,"min":25,"max":90},"raft":{"raftBaseThickness":300,"raftInterfaceThickness":200,"raftAirGap":1000,"raftLineWidth":200,"extraMargin":5000},"infill":{"amount":30,"speed":90,"pattern":"grid","overlap":15},"support":{"angle":45,"supportModel":true,"supportPlatform":true},"skirt":{"lineCount":1,"distance":3000,"minLength":150000},"dualExtrude":{"dualOverlap":1500},"movement":{"combing":true,"printSpeed":100,"travelSpeed":50,"infillSpeed":80,"outerWallSpeed":0,"innerWallSpeed":0,"bottomLayersSpeed":0,"speedupLayers":10},"bottom":{"thickness":5000,"solid":true,"layerDelay":1,"cutOff":0,"layerHeight":240},"top":{"thickness":5000,"solid":true},"layers":{"spiralize":false,"layerHeight":200,"layerCoolingTime":1,"firstLayersCount":1,"firstLayersAmount":100},"extra":{"brimLines":10,"wallThickness":200},"gcode":{"startGcode":"","endGcode":"","gcodeFlavour":"marlin"}})
			});
		}
	});