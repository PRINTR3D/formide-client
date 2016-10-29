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

module.exports = {
	wifi, update, usb, gpio
};
