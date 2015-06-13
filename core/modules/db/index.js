var models = require('./models');

module.exports = {
	
	name: "db",
	
	db: models,
	
	init: function() {
		
		// run setup when argument given in terminal
		if(FormideOS.manager('process').args.setup) {
			FormideOS.manager('debug').log('Database setup running');
			require('./setup').init(this.db);
		}
	}
}