/*
 *	This code was created for Printr B.V. It is open source under the formide-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

'use strict';

module.exports = {

    init() {
        if (!FormideClient.db) {
            FormideClient.log.error('FormideClient.db not found, please make sure there is a database connected to the client');
            return false;
        }
        return true;
    }
};
