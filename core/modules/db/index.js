var models = require('./models');

module.exports = {
	
	name: "db",
	
	db: models,
	
	init: function() {
		
		// run setup when argument given in terminal
		if(FormideOS.module('process').args.setup) {
			FormideOS.debug.log('Database setup running');
			require('./setup').init(this.db);
		}
	}
}