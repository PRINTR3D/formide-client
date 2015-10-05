/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true },
	bed: { type: Schema.Types.Mixed, required: true },
	axis: { type: Schema.Types.Mixed, required: true, default: { x: 1, y: 1, z: 1} },
	extruders: { type: Schema.Types.Mixed, required: true },
	port: { type: String, unique: true, default: 'Connect printer to select USB port' },
	baudrate: { type: Number, default: 250000 },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	cloudId: { type: String },
	startGcode: [{ type: String }],
	endGcode: [{ type: String }],
	gcodeFlavour: { type: String, required: true, default: "GCODE_FLAVOR_REPRAP" }
});
schema.plugin(timestamps);

mongoose.model('printers', schema);
var model = mongoose.model('printers');
module.exports = model;