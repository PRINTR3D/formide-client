/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = {
	identity: 'queueitem',

	connection: 'default',

	attributes: {

		origin: {
			type:     'string',
			required: true,
			enum:     ['cloud', 'local', 'custom']
		},

		gcode: {
			type: 'string'
		},

		status: {
			type:     'string',
			required: true,
			enum:     ['downloading', 'queued', 'printing', 'finished']
		},

		printJob: {
			type:     'object',
			required: true
		},

		port: {
			type: 'string',
			required: true
		},

		createdBy: {
			model: 'user'
		}
	}
};
