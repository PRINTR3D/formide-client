'use strict';

/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var driver = false;

try {
    driver = require('formide-drivers');
}
catch (e) {
    console.log('Driver thread error', e);
}

if (driver)
    driver.start(function (err, result, event) {
        if (err)
            process.send({type: 'error', data: err});
        else if (result)
            process.send({type: 'started', data: result});
        else if (event)
            process.send({type: 'event', data: event});
    });

process.on('message', function (message) {
    if (message.method && message.data && message.callbackId) {
        message.data.push(function (err, response) {
            process.send({ type: 'callback', callbackId: message.callbackId, err, result: response });
        });

        if (driver)
            driver[message.method].apply(null, message.data);
    }
});