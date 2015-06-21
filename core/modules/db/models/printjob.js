var mongoose = require('mongoose');
var timestamps  = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	modelfiles: [{ type: String, ref: 'modelfiles' }],
	gcodefile: { type: Schema.Types.ObjectId, ref: 'gcodefiles' },
	printer: { type: Schema.Types.ObjectId, ref: 'printers' },
	sliceprofile: { type: Schema.Types.ObjectId, ref: 'sliceprofiles' },
	materials: [{ type: Schema.Types.ObjectId, ref: 'materials' }],
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