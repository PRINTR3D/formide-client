/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const fs            = require('fs');
const path          = require('path');
const request       = require('request');
const exec          = require('child_process').exec;
const ini           = require('ini');
const downloadRoot  = 'http://downloads.formide.com/releases/';
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
		this.updateCheckURL = FormideOS.config.get('cloud.url') + '/products/client/latest/' + this.channel;

		// only check for update when update tools are actually available
		if (this.tools) {
			this.checkForUpdate((err, update) => {
				FormideOS.log.error(err);
				FormideOS.log('update available');
				FormideOS.log(update);
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
			this.tools.checkForUpdate(this.updateCheckURL, cb);
		else
			return cb(new Error('element-tools not found'));
	},

	update: function (cb) {
		const self = this;
		if (this.tools)
			this.checkForUpdate(function (err, update) {
				FormideOS.log('doing update:');
				FormideOS.log(update);
				self.tools.update(update.releaseNumber, update.version, downloadRoot + update.url, update.signature, cb);
			});
		else
			return cb(new Error('element-tools not found'));
	}
}
