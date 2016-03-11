/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const fs            = require('fs');
const path          = require('path');
const request       = require('request');
const ini           = require('ini');
const assert        = require('assert');

module.exports = {

	tools: null,
	channel: null,
	updateCheckURL: null,
	availableUpdate: null,

	init: function (config) {
		try {
			this.tools = require('element-tools');
		}
		catch (e) {
			FormideOS.log.warn('element-tools not found for update, probably not running on The Element');
			// FormideOS.log.warn(e);
		}

		this.channel = config.channel;

		// only check for update when update tools are actually available
		if (this.tools) {
			this.checkForUpdate((err, update) => {
				FormideOS.log('update', update);
			});
		}
	},

	getUpdateStatus: function (cb) {
		if (this.tools)
			this.tools.getUpdateStatus(cb);
		else
			return cb(new Error('element-tools not found'));
	},

	checkForUpdate: function (cb) {
		if (this.tools)
			this.tools.checkForUpdate(cb);
		else
			return cb(new Error('element-tools not found'));
	},

	update: function (cb) {
		const self = this;
		if (this.tools)
			this.checkForUpdate(function (err, update) {
				self.tools.update(update.version, update.url, update.signature, cb);
			});
		else
			return cb(new Error('element-tools not found'));
	}
}
