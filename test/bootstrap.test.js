'use strict';

/*
 * This code was created for Printr B.V. It is open source under the
 * formideos-client package.
 * Copyright (c) 2015, All rights reserved, http://printr.nl
 */

const memoryAdapter = require('sails-memory');
const pkg           = require('../package.json');
const initFormide   = require('../core/FormideOS');

before(function(done) {
    this.timeout(5000);

    const dbConfig = {
        adapters: {
            'default': memoryAdapter,
            memory:    memoryAdapter
        },
        connections: {
            default: { adapter: 'memory' }
        }
    };

    // Load formideos core file
    return initFormide(dbConfig).then(() => {

        // Load core modules
        FormideOS.moduleManager.loadModule('/core/modules/db', 'db', true);
        // FormideOS.moduleManager.loadModule('/core/modules/settings', 'settings', true);
        FormideOS.moduleManager.loadModule('/core/modules/auth', 'auth', true);

        // Activate all loaded modules
        FormideOS.moduleManager.activateLoadedModules();

        // tests
        require('./request.js')(FormideOS.http.app);

        return done();
    }, done);
});
