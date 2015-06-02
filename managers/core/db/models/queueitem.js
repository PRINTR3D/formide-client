var mongoose 		= require('mongoose')
var Schema 			= mongoose.Schema;
var deepPopulate 	= require('mongoose-deep-populate');

var schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	origin: { type: String, required: true },
	gcode: { type: String, required: true },
	status: { type: String, required: true },
	printjob: { type: Schema.Types.ObjectId, ref: 'printjobs', required: true }
});

schema.plugin(deepPopulate);
mongoose.model('queueitems', schema);
var model = mongoose.model('queueitems');
module.exports = model;