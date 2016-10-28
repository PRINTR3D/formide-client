'use strict';

/**
 * This module uses the GPIO lib available on The Element in the Felix Pro 2 to switch control
 * between The Element and external USB host.
 */

// constants
const service     = 'sudo fgpio'; // custom service that's available on The Element
const GPIO_STATUS = 'gpio91';
const GPIO_SWITCH = 'gpio90';

// modules
const exec   = require('child_process').exec;
const assert = require('assert');

module.exports = {

    registerOnChange(callback) {
        // TODO: emit to callback when USB host status changes
    },

    switchControlMode(mode, callback) {
        assert(mode, 'mode is a required parameter for switching control mode');

        var value = 0;

        if (mode === 'USB')
            value = 1;
        else if (mode === 'ELEMENT')
            value = 0;

        // set GPIO 90 to the correct value
        exec(`${service} set ${GPIO_SWITCH} ${value}`, function (err, stdout, stderr) {
            if (err || stderr)
                return callback(err || stderr);


        });
    }
}