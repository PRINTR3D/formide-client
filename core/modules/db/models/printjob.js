/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: String, ref: 'users' },
	modelfiles: [{ type: String, ref: 'modelfiles' }],
	gcodefile: { type: String, ref: 'gcodefiles' },
	printer: { type: String, ref: 'printers' },
	sliceprofile: { type: String, ref: 'sliceprofiles' },
	materials: [{ type: String, ref: 'materials' }],
	gcode: { type: String },
	sliceSettings: { type: Schema.Types.Mixed },
	sliceResponse: { type: Schema.Types.Mixed },
	sliceFinished: { type: Boolean, required: true },
	sliceMethod: { type: String, required: true }
});
schema.plugin(timestamps);

mongoose.model('printjobs', schema);
var model = mongoose.model('printjobs');
module.exports = model;