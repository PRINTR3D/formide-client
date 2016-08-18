/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var winston = require('winston');
var path	= require('path');

module.exports =
{
	logger: {},

	init: function(config) {
		this.logger = new(winston.Logger)({
			transports:
		    [
				new (winston.transports.File)({
					filename: path.join(FormideClient.config.get('app.storageDir'), config.path, 'FormideClient.log'),
					level: 'debug'
				})
		    ]
		});

		FormideClient.events.on('log.debug', this.logDebug.bind(this));
		FormideClient.events.on('log.error', this.logError.bind(this));
		FormideClient.events.on('log.info', this.logInfo.bind(this));
	},

	get: function(options, callback) {
		this.logger.query(options, function(err, results) {
			return callback(results);
		});
	},

	logDebug: function(debug) {
		this.logger.log('debug', debug.message, debug.data);
	},

	logError: function(error) {
		this.logger.log('error', error.message, error.data);
	},

	logInfo: function(info) {
		this.logger.log('info', info.message, info.data);
	}
}
