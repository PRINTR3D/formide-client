
var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/settings');
//var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Settings Api Test', function() {

    it('end point: / -> should get settings', function(done) {
        request.get('/')
            .use(bearerToken)
            .end(function(err, res) {
                if (err) done(err);
                try {
                    res.status.should.equal(200);
                    res.should.be.json;
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /exposed', function(done) {
        request.get('/exposed')
            .use(bearerToken)
            .end(function(err, res) {
               if (err) done(err);
                try {
                    res.status.should.equal(200);
                    res.should.be.json;
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
