/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = {

	tools: null,
	updateCheckURL: null,
	availableUpdate: null,

	init: function() {

		if (FormideOS.ci)
			this.tools = FormideOS.ci.update;

		// only check for update when update tools are actually available
		if (this.tools) {
			this.checkForUpdate((err, update) => {
				FormideOS.log('update', update);
			});
		}
	},

	getUpdateStatus: function(cb) {
		if (this.tools)
			this.tools.getUpdateStatus(cb);
		else
			return cb(new Error('client implementation not found'));
	},

	checkForUpdate: function (cb) {
		if (this.tools)
			this.tools.checkForUpdate((err, update) => {
				if (err)
					return cb(err);

				delete update.imageURL;
				return cb(null, update);
			});
		else
			return cb(new Error('client implementation not found'));
	},

	update: function (cb) {
		if (this.tools)
			this.tools.update(cb);
		else
			return cb(new Error('client implementation not found'));
	}
};
