var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true, unique: true },
	buildVolume: { type: Schema.Types.Mixed, required: true },
	bed: { type: Boolean, required: true },
	extruders: { type: Schema.Types.Mixed, required: true },
	port: { type: String, required: true },
	user: { type: String, ref: 'users' }
});

mongoose.model('printers', schema);
var model = mongoose.model('printers');
module.exports = model;