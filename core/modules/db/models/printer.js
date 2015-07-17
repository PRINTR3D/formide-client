/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true, unique: true },
	bed: { type: Schema.Types.Mixed, required: true },
	axis: { type: Schema.Types.Mixed, required: true, default: { x: 1, y: 1, z: 1} },
	extruders: { type: Schema.Types.Mixed, required: true },
	port: { type: String },
	baudrate: { type: Number, required: true, default: 250000 },
	user: { type: Schema.Types.ObjectId, ref: 'users' }
});
schema.plugin(timestamps);

mongoose.model('printers', schema);
var model = mongoose.model('printers');
module.exports = model;