var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/setup');
//var cfg = testUtils.config(),
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Setup Api Test', function() {

    it('should get wifi hotspot(s)', function(done) {
        request.get('/networks')
            .use(bearerToken)
            .end(function(err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    res.body[0].ssid.should.equal('MyWifiNetwork');
                    res.body[0].security.should.equal('WPA2');
                    res.body[0].signal.should.equal(65);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});