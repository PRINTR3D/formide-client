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
var sequelize 	= new Sequelize('printspot', 'root', null, {
	dialect: "sqlite",
	storage: 'server/printspot.sqlite'
});
var db			= {};
var sqliteConfig = global.config.get('database');

for(var key in sqliteConfig) {
	(function(realKey) {
		db[realKey] = sequelize.define(realKey, sqliteConfig[realKey].fields);
	})(key);
}

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);