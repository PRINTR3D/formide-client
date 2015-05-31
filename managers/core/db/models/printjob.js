var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: String, ref: 'users' },
	modelfiles: [{ type: String, ref: 'modelfiles' }],
	printer: { type: String, ref: 'printers' },
	sliceprofile: { type: String, ref: 'sliceprofiles' },
	materials: [{ type: String, ref: 'materials' }],
	gcode: { type: String },
	sliceSettings: { type: Schema.Types.Mixed },
	sliceResponse: { type: Schema.Types.Mixed, required: true },
	sliceFinished: {type: Boolean, required: true },
	sliceMethod: { type: String, required: true }
});

mongoose.model('printjobs', schema);
var model = mongoose.model('printjobs');
module.exports = model;