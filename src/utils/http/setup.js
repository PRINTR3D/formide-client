'use strict';

const fs         = require('fs');
const uuid       = require('uuid');
const Handlebars = require('handlebars');
Handlebars.registerHelper('list', (ctx, opt) => ctx.reduce((prev, curr) => prev + opt.fn(curr), ''));

/**
 * Get setup page for Wi-Fi and Formide account connection
 * @param platformUrl
 * @param callback
 */
function getWlanSetupPage(wifi, callback) {
    fs.readFile(__dirname + "/setup.html", 'utf8', (err, data) => {
        if (err)
            return callback(err);

        const template = Handlebars.compile(data);

        // wifi.mac((macErr, macAddress) => {
        //     if (macErr)
        //         return callback(macErr);
        //
        //     wifi.list((wifiErr, ssids) => {
        //         if (wifiErr)
        //             return callback(wifiErr);
        //
        const networks = [];
        //         for (const ssid in ssids)
        //             networks.push({ ssid });

        const platformUrl = FormideClient.config.get('cloud.platformUrl');
        const registrationToken = uuid.v4();
        const redirectUrl = `${platformUrl}/#/manage/devices/setup?registration_token=${registrationToken}`

        const html = template({
            networks,
            // macAddress,
            registrationToken,
            redirectUrl
        });
        return callback(null, html);
        //     });
        // });
    });
}

module.exports = getWlanSetupPage;