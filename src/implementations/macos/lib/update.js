'use strict';

/**
 * This module handles updates on MacOS. It only updates formide-client, where as The Element implementation does a full OTA update.
 */

const AutoUpdater = require('auto-updater');

module.exports = {

    /**
     * Returns the current client version from package.json
     * @param callback
     */
    getCurrentVersion(callback) {
        const version = require('../../../../package.json').version;
        return callback(null, version);

        return callback(null, {
            version: version,
            flavour: 'mac',
            date:    new Date()
        });
    },

    /**
     * Get status from last update.
     * Since Mac implementation doesn't really support full updates, we simulate this
     * @param callback
     */
    getUpdateStatus(callback) {
        return callback(null, {
            success: true,
            timestamp: new Date(),
            message: 'The client was successfully updated'
        });
    },

    /**
     * We use a package called auto-updated to let the client update itself
     * @param callback
     */
    checkForUpdate(callback) {

        const autoupdater = new AutoUpdater({
            pathToJson: '',
            autoupdate: false,
            checkgit: false,
            jsonhost: 'raw.githubusercontent.com',
            contenthost: 'codeload.github.com',
            progressDebounce: 0,
            devmode: true
        });

        autoupdater.on('git-clone', function() {
            return callback(null, {
                message:     "You have a clone of the repository. Use 'git pull' to be up-to-date",
                needsUpdate: false
            });
        });

        autoupdater.on('check.up-to-date', function(v) {
            return callback(null, {
                message:     "You have the latest version: " + v,
                needsUpdate: false
            });
        });

        autoupdater.on('check.out-dated', function(v_old, v) {
            return callback(null, {
                message:     'Update found',
                needsUpdate: true,
                imageURL:    'PRINTR3D/formide-client',
                version:     v,
                autoupdater: autoupdater
            });
        });

        autoupdater.on('error', function(name, e) {
            console.error(name, e);
        });

        // Start checking
        autoupdater.fire('check');
    },

    update(imageURL, signature, callback) {
        this.checkForUpdate(function (err, hasUpdate) {
            if (err) return callback (err);

            if (!hasUpdate.autoupdater)
                return callback(new Error('incomplete update object'));

            hasUpdate.autoupdater.fire('download-update');

            hasUpdate.autoupdater.on('update.downloaded', function() {
                console.log("Update downloaded and ready for install");
                hasUpdate.autoupdater.fire('extract');
            });

            hasUpdate.autoupdater.on('update.not-installed', function() {
                console.log("The Update was already in your folder! It's read for install");
                hasUpdate.autoupdater.fire('extract');
            });

            hasUpdate.autoupdater.on('update.extracted', function() {
                console.log("Update extracted successfully!");

                const deps = hasUpdate.autoupdater.fire('diff-dependencies');
                console.log(deps);

                console.warn("RESTART THE APP!");
            });

            hasUpdate.autoupdater.on('download.start', function(name) {
                console.log("Starting downloading: " + name);
            });

            hasUpdate.autoupdater.on('download.end', function(name) {
                console.log("Downloaded " + name);
            });
        });
    }
}