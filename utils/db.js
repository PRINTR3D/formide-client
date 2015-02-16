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

var Sequelize 	= require('sequelize');
var lodash    	= require('lodash');

module.exports = function(config, rootDir)
{
	var config = config.get('database');
	var db = {};
	var sequelize = null;

	sequelize = new Sequelize(config.database, config.username, config.password, {
		dialect: 'sqlite',
		storage: rootDir + config.storage,
		logging: config.debug
	});

	var registerModels = function()
	{
		db.User = sequelize.define('User', {
		    "username": "STRING",
		    "password": "STRING"
		});

		db.Printjob = sequelize.define('Printjob', {
			"userID": "INTEGER",
			"printerID": "INTEGER",
			"sliceprofileID": "INTEGER",
			"materials": "TEXT",
			"gcode": "STRING",
			"sliceParams": "TEXT",
			"sliceResponse": "TEXT",
			"sliceMethod": "STRING",
			"ModelfileId": "INTEGER"
		});

		db.Queueitem = sequelize.define('Queueitem', {
			"origin": "STRING",
			"gcode": "STRING",
			"status": "STRING",
			"PrintjobId": "INTEGER"
		});

		db.Modelfile = sequelize.define('Modelfile', {
			"filename": "STRING",
			"filesize": "INTEGER",
			"hash": "STRING",
			"userID": "INTEGER"
		});

		db.Printer = sequelize.define('Printer', {
			"name": "STRING",
			"buildVolumeX": "INTEGER",
			"buildVolumeY": "INTEGER",
			"buildVolumeZ": "INTEGER",
			"bed": "BOOLEAN",
			"extruders": "TEXT"
		});

		db.Material = sequelize.define('Material', {
			"name": "STRING",
			"type": "STRING",
			"filamentDiameter": "INTEGER",
			"temperature": "INTEGER",
			"firstLayersTemperature": "INTEGER",
			"bedTemperature": "INTEGER",
			"firstLayersBedTemperature": "INTEGER",
			"feedrate": "INTEGER"
		});

		db.Sliceprofile = sequelize.define('Sliceprofile', {
			"name": "STRING",
			"settings": "TEXT"
		});
	};

	var registerAssociations = function()
	{

		Object.keys(db).forEach(function(modelName) {
		  	if ('associate' in db[modelName]) {
		    	db[modelName].associate(db)
		  	}
		});

		db.Printjob.hasMany(db.Queueitem);
		db.Queueitem.belongsTo(db.Printjob);

		db.Modelfile.hasMany(db.Printjob);
		db.Printjob.belongsTo(db.Modelfile);
	};

	registerModels();
	registerAssociations();

	return lodash.extend({
		sequelize: sequelize,
		Sequelize: Sequelize
	}, db);
}