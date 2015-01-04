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

module.exports = {

	db: {},

	sequelize: null,

	init: function(config)
	{
		this.sequelize = new Sequelize(config.database, config.username, config.password, {
			dialect: 'sqlite',
			storage: config.storage,
			logging: config.debug
		});

		this.registerModels();
		this.registerAssociations();

		return lodash.extend({
			sequelize: this.sequelize,
			Sequelize: Sequelize
		}, this.db);
	},

	registerModels: function()
	{
		this.db.User = this.sequelize.define('User', {
		    "username": "STRING",
		    "password": "STRING"
		});

		this.db.Printjob = this.sequelize.define('Printjob', {
			//"modelfileID": "INTEGER",
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

		this.db.Queueitem = this.sequelize.define('Queueitem', {
			"origin": "STRING",
			"gcode": "STRING",
			"status": "STRING",
			"PrintjobId": "INTEGER"
		});

		this.db.Modelfile = this.sequelize.define('Modelfile', {
			"filename": "STRING",
			"filesize": "INTEGER",
			"hash": "STRING",
			"userID": "INTEGER"
		});

		this.db.Printer = this.sequelize.define('Printer', {
			"name": "STRING",
			"buildVolumeX": "INTEGER",
			"buildVolumeY": "INTEGER",
			"buildVolumeZ": "INTEGER",
			"bed": "BOOLEAN",
			"extruders": "TEXT"
		});

		this.db.Material = this.sequelize.define('Material', {
			"name": "STRING",
			"type": "STRING",
			"filamentDiameter": "INTEGER",
			"temperature": "INTEGER",
			"firstLayersTemperature": "INTEGER",
			"bedTemperature": "INTEGER",
			"firstLayersBedTemperature": "INTEGER",
			"feedrate": "INTEGER"
		});

		this.db.Sliceprofile = this.sequelize.define('Sliceprofile', {
			"name": "STRING",
			"settings": "TEXT"
		});
	},

	registerAssociations: function()
	{
		var _this = this;

		Object.keys(_this.db).forEach(function(modelName) {
		  	if ('associate' in _this.db[modelName]) {
		    	_this.db[modelName].associate(_this.db)
		  	}
		});

		this.db.Printjob.hasMany(this.db.Queueitem);
		this.db.Queueitem.belongsTo(this.db.Printjob);

		this.db.Modelfile.hasMany(this.db.Printjob);
		this.db.Printjob.belongsTo(this.db.Modelfile);
	}
}