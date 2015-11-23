var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/db');
var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Database Modelfiles Api Test Suite', function() {

    it('end point: /modelfiles -> ', function(done) {
        request.get('/modelfiles')
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);

                    done();
                } catch (e) {
                    done(e);
                } finally {

                }
            });
    });

});
