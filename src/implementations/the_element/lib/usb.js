'use strict';

const exec    = require('child_process').exec;
const service = 'sudo fusb';

module.exports = {

	drives(callback) {
		exec(`${service} drives`, (err, stdout) => {
			if (err)
				return callback(err);

			const drives = stdout.trim();
			return callback(null, drives);
		});
	},

	mount(drive, callback) {
		exec(`${service} mount ${drive}`, (err, stdout, stderr) => {
			if (err || stderr)
				return callback(err || stderr);

			return callback(null, stdout);
		});
	},

	unmount(drive, callback) {
		exec(`${service} unmount ${drive}`, (err, stdout, stderr) => {
			if (err)
				return callback(err || stderr);

			return callback(null, stdout);
		});
	},

	read(drive, path, callback) {
		exec(`${service} read ${drive} ${path}`, (err, stdout) => {
			if (err)
				return callback(err);

			const files = stdout.trim();
			return callback(null, files);
		});
	},

	copy(drive, path, target, uuid, callback) {
		exec(`${service} copy ${drive} ${path} ${target} ${uuid}`, (err, stdout, stderr) => {
			if (err || stderr)
				return callback(err || stderr);

			return callback(null, stdout);
		});
	}
};
