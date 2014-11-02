var Sequelize 	= require('sequelize');
var sequelize 	= new Sequelize('printspot', 'root', null, {
	dialect: "sqlite",
	storage: 'server/printspot.sqlite',
	define: {
		charset: 'utf8'
	}
});
var sqliteConfig = require('./config/db.json');

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
		}
	});