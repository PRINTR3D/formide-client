var Sequelize 	= require('sequelize');
var lodash    	= require('lodash');
var sequelize 	= new Sequelize('printspot', 'root', null, {
	dialect: "sqlite",
	storage: 'server/printspot.sqlite'
});
var db			= {};
var sqliteConfig = require('./../../printspot-config/db.json');

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

global.log('info', 'Module loaded: db.js', {});