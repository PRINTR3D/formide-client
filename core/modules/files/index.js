/*
 *	    ____  ____  _____   ____________
 *	   / __ / __ /  _/ | / /_  __/ __
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	nu circumstances be copied or used in other
 *	applications than for Printr B.V.
 *
 */

var fs		= require('fs');
var uuid	= require('node-uuid');

module.exports = {
	
	uploadModelfile: function(file, callback) {
		fs.readFile(file.path, function(err, data) {
			var hash = uuid.v4();
			var newPath = FormideOS.config.get('paths.modelfile') + '/' + hash;
			fs.writeFile(newPath, data, function(err) {
				if (err) {
					FormideOS.debug.log(err);
					return callback(err);
				}
				else {
					FormideOS.module('db').db.Modelfile.create({
						filename: file.name,
						filesize: file.size,
						hash: hash
					}, function(err, modelfile) {
						if (err) return callback(err)
						return callback(null, modelfile);
					});
				}
			});
		});
	},

	uploadGcode: function(file, callback) {
		fs.readFile(file.path, function( err, data ) {
			var hash = uuid.v4();
			var newPath = FormideOS.config.get('paths.gcode') + '/' + hash;
			fs.writeFile(newPath, data, function(err) {
				if(err) {
					FormideOS.debug.log( err );
					return callback(err);
				}
				else {
					FormideOS.module('db').db.Gcodefile.create({
						filename: file.name,
						filesize: file.size,
						hash: hash
					}, function(err, gcodefile) {
						if (err) return callback(err)
						return callback(null, gcodefile);
					});
				}
			});
		});
	},

	downloadModelfile: function(hash, encoding, callback) {
		var filename = FormideOS.config.get('paths.modelfile') + '/' + hash;
		fs.exists(filename, function(exists) {
			if(exists) {
				fs.readFile(filename, function(err, data) {
					if (err) {
						FormideOS.debug.log(err, true);
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

	downloadGcode: function(hash, encoding, callback) {
		var filename = FormideOS.config.get('paths.gcode') + '/' + hash;
		fs.exists(filename, function(exists) {
			if (exists) {
				fs.readFile(filename, function(err, data) {
					if(err) {
						FormideOS.debug.log(err, true);
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
	}
}