'use strict';

/**
 * This module uses the GPIO lib available on The Element in the Felix Pro 2 to switch control
 * between The Element and external USB host.
 */

const service     = 'sudo fgpio'; // custom service that's available on The Element
const GPIO_STATUS = '';
const GPIO_SWITCH = '';

module.exports = {

    registerOnChange(callback) {
        // TODO: emit to callback when USB host status changes
    },

    switchControlMode(mode, callback) {
        // TODO: call GPIO lib to change control mode
    }
}