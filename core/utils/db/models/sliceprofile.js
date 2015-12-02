/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports ={
	identity: 'sliceprofile',

	connection: 'default',

	attributes: {

		// name of sliceprofile, presets should use something descriptive like "Felix Pro Medium Quality"
		name: {
			type: 'string',
			required: true
		},

		createdBy: {
			model: 'User',
			required: true
		},

		settings: {
			type: 'object',
			required: true,
			//is_valid_sliceprofile: true
		},

		// we keep track of sliceprofiles versions to deal with slicer updates
		version: {
			type: 'string'
		},

		printJobs: {
			collection: 'printjob',
			via: 'sliceProfile'
		}
	},

	types: {

		// custom validator to check if all parameters are in the sliceprofile
		// is_valid_sliceprofile: function (val) {
		//
		// 	var reference = require(FormideOS.appRoot + "bin/reference-" + self.config.version + ".json");
		//
		// 	FormideOS.log.debug(" ");
		// 	FormideOS.log.debug("Checking sliceprofile...");
		// 	for (var i in reference.sliceProfile) {
		// 		FormideOS.log.debug(i);
		// 		if (typeof val[i] === "undefined") return false;
		// 		for (var j in reference.sliceProfile[i]) {
		// 			if (typeof val[i][j] === "undefined" && reference.sliceProfile[i][j].mandatory === true) {
		// 				FormideOS.log.error('✗ ' + j);
		// 				return false;
		// 			}
		// 			FormideOS.log.debug('✓ ' + j);
		// 		}
		// 	}
		// 	FormideOS.log.debug("Finished checking sliceprofile");
		// 	FormideOS.log.debug(" ");
		// 	return true;
		// }
	}
};
