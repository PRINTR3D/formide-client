var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String },
	buildVolumeX: { type: Number },
	buildVolumeY: { type: Number },
	buildVolumeZ: { type: Number },
	bed: { type: Boolean },
	extruders: { type: Schema.Types.Mixed },
	port: { type: String },
	user: { type: String, ref: 'users' }
});

mongoose.model('printers', schema);
var model = mongoose.model('printers');
module.exports = model;