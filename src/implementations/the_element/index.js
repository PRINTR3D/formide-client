'use strict';

const wifi   = require('./lib/wifi');
const update = require('./lib/update');
const usb    = require('./lib/usb');
// const gpio   = require('./lib/gpio');

module.exports = {
	wifi, update, usb
};
