/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var uuid = require('node-uuid');

module.exports = function(Waterline) {

	var Log = Waterline.Collection.extend({
	
		identity: 'log',
		
		connection: 'default',
		
		attributes: {
			
			user: {
				model: 'User',
				required: true
			},
			
			data: {
				type: 'object',
				required: true
			},
			
			type: {
				type: 'string',
				required: true,
				enum: ["slicer", "printer", "device", "session", "account"]
			},
			
			message: {
				type: 'string',
				required: true
			},
			
			level: {
				type: 'string',
				required: true,
				enum: ["info", "warning", "error", "silly"]
			},
			
			uuid: {
				type: 'string'
			}
		},
		
		// hash password before saving user to database
		beforeCreate: function (log, next) {
			log.uuid = uuid.v4();
			next();
		}
	});
	
	return Log;
}