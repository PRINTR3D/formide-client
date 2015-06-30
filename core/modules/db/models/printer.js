var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true, unique: true },
	bed: { type: Schema.Types.Mixed, required: true },
	extruders: { type: Schema.Types.Mixed, required: true },
	port: { type: String, required: true, default: "/dev/null" },
	baudrate: { type: Number, required: true, default: 115200 },
	user: { type: Schema.Types.ObjectId, ref: 'users' }
});
schema.plugin(timestamps);

mongoose.model('printers', schema);
var model = mongoose.model('printers');
module.exports = model;