/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(Waterline) {

	var Printjob = Waterline.Collection.extend({
	
		identity: 'printjob',
		
		connection: 'default',
		
		attributes: {
			user: {
				model: 'User',
				required: true
			},
			
			files: {
				collection: 'UserFile',
				required: true
			},
			
			printer: {
				model: 'Printer',
				required: true
			},
			
			sliceprofile: {
				model: 'Sliceprofile',
				required: true
			},
			
			materials: {
				collection: 'Material',
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
	});
	
	return Printjob;
}