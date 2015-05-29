var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: String, ref: 'users' },
	modelfile: { type: String, ref: 'modelfiles' },
	printer: { type: String, ref: 'printers' },
	sliceprofile: { type: String, ref: 'sliceprofiles' },
	materials: [{ type: String, ref: 'materials' }],
	gcode: { type: String },
	sliceParams: { type: Schema.Types.Mixed },
	sliceResponse: { type: Schema.Types.Mixed },
	sliceMethod: { type: String }
});

mongoose.model('printjobs', schema);
var model = mongoose.model('printjobs');
module.exports = model;