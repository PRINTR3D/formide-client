var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String },
	type: { type: String },
	fialmentDiameter: { type: Number },
	temperature: { type: Number },
	firstLayersTemperature: { type: Number },
	bedTemperature: { type: Number },
	firstLayersBedTemperature: { type: Number },
	feedrate: { type: Number },
	user: { type: String, ref: 'users' }
});

mongoose.model('materials', schema);
var model = mongoose.model('materials');
module.exports = model;