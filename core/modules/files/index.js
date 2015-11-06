/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */
 
var fs		= require('fs');
var uuid	= require('node-uuid');
var request	= require('request');

module.exports = {
	
	/*
	 * Handle file upload
	 */
	uploadFile: function(file, filetype, userId, callback) {
		fs.readFile(file.path, function(err, data) {
			var hash = uuid.v4();
			var newPath = FormideOS.config.get('app.storageDir') + FormideOS.config.get('paths.modelfiles') + '/' + hash;
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
						user: userId
					}, function(err, userFile) {
						if (err) return callback(err)
						return callback(null, userFile);
					});
				}
			});
		});
	},

	/*
	 * Handle modelfile download
	 */
	downloadFile: function(hash, encoding, userId, callback) {
		// TODO: check user ID
		var filename = FormideOS.config.get('app.storageDir') + FormideOS.config.get('paths.modelfiles') + '/' + hash;
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
				return callback('file not found');
			}
		});
	},
	
	/*
	 * Handle upload from remote url
	 */
	uploadFromUrl: function(url, filename, filetype, userId, callback) {
		request({
			method: 'GET',
			url: url
		})
		.on('response', function(response) {
			var regexp = /filename=\"(.*)\"/gi;
			var hash = uuid.v4();
			var newPath = FormideOS.config.get('app.storageDir') + FormideOS.config.get('paths.modelfiles') + '/' + hash;
			var fws = fs.createWriteStream(newPath);
			response.pipe(fws);
			response.on( 'end', function() {
				FormideOS.db.UserFile.create({
					prettyname: filename,
					filename: filename,
					filesize: fws.bytesWritten,
					filetype: filetype,
					hash: hash,
					user: userId
				}, function(err, userFile) {
					if (err) return callback(err)
					return callback(null, userFile);
				});
        	});
		});
	}
}