'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var fs			= require('fs');
var path		= require('path');
var uuid		= require('node-uuid');
var diskspace	= require('diskspace');

module.exports = {

	/**
	 * Upload a file to embedded storage and DB
	 * @param file
	 * @param filetype
	 * @param userId
	 * @param callback
	 */
	uploadFile: function(file, filetype, userId, callback) {
		fs.readFile(file.path, function(err, data) {
			if (err) {
				FormideOS.log.error(err.message);
				return callback(err);
			}

			var hash = uuid.v4();
			var newPath = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.modelfiles'), hash);

			fs.writeFile(newPath, data, function(err) {
				if (err) {
					FormideOS.log.error(err.message);
					return callback(err);
				}
				else {
					FormideOS.db.UserFile.create({
						prettyname: file.name,
						filename: file.name,
						filesize: file.size,
						filetype: filetype,
						hash: hash,
						createdBy: userId
					}, function(err, userFile) {
						if (err) return callback(err)
						return callback(null, userFile);
					});
				}
			});
		});
	},

	/**
	 * Download a file from embedded storage
	 * @param hash
	 * @param encoding
	 * @param userId
	 * @param callback
	 */
	downloadFile: function(hash, encoding, userId, callback) {
		// TODO: check user ID
		var filename = path.join(FormideOS.config.get('app.storageDir'), FormideOS.config.get('paths.modelfiles'), hash);
		fs.exists(filename, function(exists) {
			if(exists) {
				fs.readFile(filename, function(err, data) {
					if (err) {
						FormideOS.log.error(err.message);
						return callback(err);
					}
					else {
						if(encoding == 'base64') {
							var base64File = new Buffer(data, 'binary').toString('base64');
							return callback(null, base64File);
						}
						else {
							return callback(null, data);
						}
					}
				});
			}
			else {
				return callback(null, null);
			}
		});
	},

	/**
	 * Get embedded storage usage info
	 * @param callback
	 */
	getDiskSpace(callback) {
		diskspace.check('/data', function (err, total, free, status) {
			if (err) return callback(err);
			return callback(null, { total, free, status });
		});
	},

	/**
	 * Get a list of all attached storage drives
	 * @param callback
	 */
	getDrives(callback) {

	},

	/**
	 * Mount an external drive to start using it
	 * @param drive
	 * @param callback
	 */
	mountDrive(drive, callback) {

	},

	/**
	 * Unmount an external drive before unplugging it
	 * @param drive
	 * @param callback
	 */
	unmountDrive(drive, callback) {

	},

	/**
	 * List files in drive (or subpath)
	 * @param drive
	 * @param path
	 * @param callback
	 */
	listFiles(drive, path, callback) {

	},

	/**
	 * Copy file from drive to embedded storage and DB
	 * @param drive
	 * @param path
	 * @param callback
	 */
	copyFile(drive, path, callback) {

	}
};
