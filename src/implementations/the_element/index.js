'use strict';

const fs   = require('fs');
const uuid = require('uuid');

const Handlebars = require('handlebars');
Handlebars.registerHelper('list',
    (ctx, opt) => ctx.reduce((prev, curr) => prev + opt.fn(curr), ''));

const wifi   = require('./lib/wifi');
const update = require('./lib/update');
const usb    = require('./lib/usb');
const gpio   = require('./lib/gpio');

const wifiApi = {
	networks(callback) {
		wifi.list(callback);
	},

	network(callback) {
		wifi.network(callback);
	},

	status(callback) {
		wifi.status(callback);
	},

	getIp(callback) {
		wifi.ip(callback);
	},

	getMac(callback) {
		wifi.mac(callback);
	},

	connect(essid, password, callback) {
		wifi.connectToNetwork(essid, password, (err, success) => {
			if (err)
				return callback(err);

			console.log('Connected to', essid);

			return callback(null, true);
		});
	},

	reset(callback) {
		wifi.reset(callback);
	},

	getWlanSetupPage(platformUrl, callback) {
		fs.readFile(__dirname + "/networks.html", 'utf8', (err, data) => {
			if (err)
				return callback(err);

			const template = Handlebars.compile(data);

			wifi.mac((macErr, macAddress) => {
				if (macErr)
					return callback(macErr);

				wifi.list((wifiErr, ssids) => {
					if (wifiErr)
						return callback(wifiErr);

					const networks = [];
					for (const ssid in ssids)
						networks.push({ ssid });

					const registrationToken = uuid.v4();
					const redirectUrl
						= `${platformUrl}/#/manage/devices/setup?registration_token=${registrationToken}`

					const html = template({
						networks,
						macAddress,
						registrationToken,
						redirectUrl
					});
					return callback(null, html);
				});
			});
		});
	}
};

const updateApi = {
	getCurrentVersion(callback) {
		update.getCurrentVersion(callback);
	},

	getUpdateStatus(callback) {
		update.getUpdateStatus(callback);
	},

	checkForUpdate(callback) {
		update.checkForUpdate(callback);
	},

	// update is response from the factory service api
	update(callback) {
		this.checkForUpdate((err, hasUpdate) => {
			if (err)
				return callback(err);

			if (!hasUpdate.imageURL || !hasUpdate.signature)
				return callback(new Error('incomplete update object'));

			update.update(hasUpdate.imageURL, hasUpdate.signature, callback);
		});
	}
};

const usbApi = {
	drives(callback) {
		usb.drives(callback);
	},

	mount(drive, callback) {
		usb.mount(drive, callback);
	},

	unmount(drive, callback) {
		usb.unmount(drive, callback);
	},

	read(drive, path, callback) {
		usb.read(drive, path, callback);
	},

	copy(drive, path, target, uuid, callback) {
		usb.copy(drive, path, target, uuid, callback);
	}
};

const gpioApi = gpio;

module.exports = {
	wifi:   wifiApi,
	update: updateApi,
	usb:    usbApi,
	gpio:   gpioApi
};
