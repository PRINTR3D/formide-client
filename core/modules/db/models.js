/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var Schema = FormideOS.db.mongoose.Schema;

// materials
var materialsSchema = new Schema({
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
FormideOS.db.addModel("materials", "Material", materialsSchema);

// printers
var printersSchema = new Schema({
	name: { type: String, required: true },
	bed: { type: Schema.Types.Mixed, required: true },
	axis: { type: Schema.Types.Mixed, required: true, default: { x: 1, y: 1, z: 1} },
	extruders: { type: Schema.Types.Mixed, required: true },
	port: { type: String, unique: true, default: 'Connect printer to select USB port' },
	baudrate: { type: Number, default: 250000 },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	//cloudId: { type: String },
	startGcode: [{ type: String }],
	endGcode: [{ type: String }],
	gcodeFlavour: { type: String, required: true, default: "GCODE_FLAVOR_REPRAP" }
});
FormideOS.db.addModel("printers", "Printer", printersSchema);

// sliceprofiles
var sliceprofilesSchema = new Schema({
	name: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	version: { type: String, required: true, default: "1.0.0" },
	settings: { type: Schema.Types.Mixed, required: true }
});
FormideOS.db.addModel("sliceprofiles", "Sliceprofile", sliceprofilesSchema);

// modelfiles
var modelfilesSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'users' },
	prettyname: { type: String, required: true },
	filename: { type: String, required: true },
	filesize: { type: Number, required: true },
	filetype: { type: String, default: "stl"},
	hash: { type: String, required: true }
});
FormideOS.db.addModel("modelfiles", "Modelfile", modelfilesSchema);

// printjobs
var printjobsSchema = new Schema({
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
FormideOS.db.addModel("printjobs", "Printjob", printjobsSchema);

// queue
var queueSchema = new Schema({
	user: { type: String, ref: 'users' },
	origin: { type: String, required: true },
	gcode: { type: String, required: true },
	status: { type: String, required: true },
	printjob: { type: Schema.Types.Mixed },
	port: { type: String, required: true }
});
FormideOS.db.addModel("queueitems", "Queueitem", queueSchema);