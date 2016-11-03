'use strict';

/**
 * This module uses the GPIO lib available on The Element in the Felix Pro 2 to switch control
 * between The Element and external USB host.
 */

// modules
const assert = require('assert');
const Gpio = require('onoff').Gpio;

// GPIO pins
const controlMode = new Gpio(90, 'out');
const usbStatus = new Gpio(93, 'in', 'both');
const dtrTargetReset = new Gpio(6, 'out');

// default to ELEMENT control
setTimeout(function() {
    // controlMode.writeSync(0);
}, 500);

// free up GPIO again when stopping client
process.on('SIGINT', function () {
    controlMode.unexport();
    usbStatus.unexport();
    dtrTargetReset.unexport();
});

module.exports = {

    /**
     * When USB is plugged in, emit an event to registered callback functions
     * @param callback
     */
    registerOnChange(callback) {
        usbStatus.watch(function (err, value) {
            if (err)
                return callback(err);

            if (value === 0)
                return callback(null, 'plugged-out');
            else if (value === 1)
                return callback(null, 'plugged-in');
        });
    },

    /**
     * Get current value of control mode GPIO
     * @param callback
     */
    getControlMode(callback) {
        controlMode.read(function (err, value) {
            if (err)
                return callback(err);

            value = +(value); // force int
            var mode = '';

            if (value === 0)
                mode = 'ELEMENT';
            else if (value === 1)
                mode = 'USB';

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

        if (mode === 'ELEMENT')
            value = 0;
        else if (mode === 'USB')
            value = 1;
        else
            return callback(new Error('Mode invalid'));

        // this toggles DTR reset in the printer firmware!
        dtrTargetReset.writeSync(0);
        dtrTargetReset.writeSync(1);

        // set control mode
        controlMode.write(value, function (err) {
            if (err)
                return callback(err);

            return callback(null, 'OK');
        });
    }
}