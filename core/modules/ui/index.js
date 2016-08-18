/*
 *	This code was created for Printr B.V. It is open source under the formideos-interface package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

var express = require('express');
var app 	= express();

module.exports = {

    server: null,
    port: 8080,

    init: function() {
        this.startInterface();
    },

    dispose: function() {
        // stop server before disposing module
        this.server.close();
    },

    startInterface: function() {

        this.server = require('http').Server(app);
        this.server.listen(this.port);
        FormideClient.log.debug('Interface started on port ' + this.port);

        // app (component views)
        app.get('/app/*', function(req, res) {
            return res.sendfile(req.params[0], {root: __dirname + '/app'});
        });

        // basic app environment info
        app.get('/api/env', function(req, res) {
            var pkg = require("../../../package.json");
            return res.json({
                environment: FormideClient.config.environment,
                name: pkg.name,
                version: pkg.version,
                location: "local"
            });
        });

        // public assets
        app.get('/public/*', function(req, res) {
            return res.sendfile(req.params[0], { root: FormideClient.appRoot + '/public' });
        });

        // angular app
        app.get('/*', function(req, res) {
            return res.sendfile('index.html', { root: __dirname });
        });
    }
};
