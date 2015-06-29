var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true, unique: true },
	type: { type: String, required: true },
	filamentDiameter: { type: Number, required: true },
	temperature: { type: Number, required: true },
	firstLayersTemperature: { type: Number },
	bedTemperature: { type: Number, required: true },
	firstLayersBedTemperature: { type: Number },
	feedrate: { type: Number, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'users' }
});
schema.plugin(timestamps);

mongoose.model('materials', schema);
var model = mongoose.model('materials');
module.exports = model;