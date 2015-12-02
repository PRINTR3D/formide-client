/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
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

		files: {
			collection: 'userfile',
			via: 'printJobs',
			required: true
		},

		printer: {
			model: 'printer',
			via: 'printJobs',
			required: true
		},

		sliceProfile: {
			model: 'sliceprofile',
			via: 'printJobs',
			required: true
		},

		materials: {
			collection: 'material',
			via: 'printJobs',
			required: true
		},

		gcode: {
			type: 'string'
		},

		responseId: {
			type: 'string',
			required: true
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
