/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = (routes, module) => {

    // require submodules for individual rest resources
    require('./rest/material.js')(routes, FormideClient.db);
    require('./rest/sliceprofile.js')(routes, FormideClient.db);
    require('./rest/printer.js')(routes, FormideClient.db);
};
