/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = {
	identity: 'printjob',

	connection: 'default',

	attributes: {
		createdBy: {
			model: 'user',
			via: 'printJobs',
			required: true
		},

		name: {
			type: 'string',
			required: true
		},

		files: {
			collection: 'userfile',
			via: 'printJobs',
			required: true
		},

		printer: {
			model: 'printer',
			via: 'printJobs'
		},

		sliceProfile: {
			model: 'sliceprofile',
			via: 'printJobs'
		},

		materials: {
			collection: 'material',
			via: 'printJobs'
		},

		gcode: {
			type: 'string'
		},

		responseId: {
			type: 'string'
		},

		sliceSettings: {
			type: 'object'
		},

		sliceRequest: {
			type: 'object'
		},

		sliceResponse: {
			type: 'object'
		},

		sliceFinished: {
			type: 'boolean',
			defaultsTo: false
		},

		sliceMethod: {
			type: 'string',
			required: true,
			enum: ["cloud", "local", "custom"]
		}
	}
};
