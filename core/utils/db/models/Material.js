/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var uuid = require('node-uuid');

module.exports = function(Waterline) {

	var Material = Waterline.Collection.extend({
	
		identity: 'material',
		
		connection: 'default',
		
		attributes: {
			
			name: {
				type: 'string',
				required: true
			},
			
			type: {
				type: 'string',
				required: true
			},
			
			filamentDiameter: {
				type: 'integer',
				required: true,
				defaultsTo: 1750
			},
			
			temperature: {
				type: 'integer',
				required: true
			},
			
			firstLayersTemperature: {
				type: 'integer',
				required: true
			},
			
			bedTemperature: {
				type: 'integer',
				required: true
			},
			
			firstLayersBedTemperature: {
				type: 'integer',
				required: true
			},
			
			feedrate: {
				type: 'integer',
				defaultsTo: 100
			},
			
			user: {
				model: "User",
				required: true
			}
		}
	});
	
	return Material;
}