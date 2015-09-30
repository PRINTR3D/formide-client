/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	version: { type: String, required: true, default: "0.10.0" },
	settings: { type: Schema.Types.Mixed, required: true }
});
schema.plugin(timestamps);

mongoose.model('sliceprofiles', schema);
var model = mongoose.model('sliceprofiles');
module.exports = model;