'use strict';

/**
 * This module uses the GPIO lib available on The Element in the Felix Pro 2 to switch control
 * between The Element and external USB host.
 */

// constants
const service     = 'sudo fgpio'; // custom service that's available on The Element
const GPIO_STATUS = 'gpio91';
const GPIO_SWITCH = 'gpio90';

// statuses
const SWITCH_0    = 'ELEMENT';
const SWITCH_1    = 'USB';
const STATUS_0    = 'NOT_PLUGGED';
const STATUS_1    = 'PLUGGED';

// modules
const exec   = require('child_process').exec;
const assert = require('assert');

module.exports = {

    /**
     * When USB is plugged in, emit an event to registered callback functions
     * @param callback
     */
    registerOnChange(callback) {

    },

    /**
     * Get current value of control mode GPIO
     * @param callback
     */
    getControlMode(callback) {
        exec(`${service} get ${GPIO_SWITCH}`, function (err, stdout, stderr) {
            if (err || stderr)
                return callback(err || stderr);

            var value = +(stdout);
            var mode = '';

            if (value === 0)
                mode = SWITCH_0;
            else if (value === 1)
                mode = SWITCH_1;

            return callback(null, mode);
        });
    },

    /**
     * Switch control mode between ELEMENT and USB
     * @param mode
     * @param callback
     */
    switchControlMode(mode, callback) {
        assert(mode, 'mode is a required parameter for switching control mode');

        var value = 0;

        if (mode === SWITCH_0)
            value = 0;
        else if (mode === SWITCH_1)
            value = 1;

        // set GPIO 90 to the correct value
        exec(`${service} set ${GPIO_SWITCH} ${value}`, function (err, stdout, stderr) {
            if (err || stderr)
                return callback(err || stderr);


        });
    }
}