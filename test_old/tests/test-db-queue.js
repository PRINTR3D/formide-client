var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/db');
//var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Job Queue Api Test', function() {

    it('end point: /queue', function(done) {
        request.get('/queue')
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
