/*
 *	This code was created for Printr B.V. It is open source under the formideos-client package.
 *	Copyright (c) 2015, All rights reserved, http://printr.nl
 */

module.exports = function(routes, module) {

    routes.get('/', function (req, res) {
        module.checkForUpdate(function (err, response) {
            if (err) return res.serverError(err);
            return res.ok(response);
        });
    });

    routes.post('/', function (req, res) {
        module.doUpdate(function (err) {
            if (err) return res.serverError(err);
            return res.ok({ message: 'Starting update' });
        });
    });
}
