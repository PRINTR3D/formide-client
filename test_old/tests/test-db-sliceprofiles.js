var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/db');
var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Slice profiles Api Test', function() {

    it('end point: /sliceprofiles -> should get default profile', function(done) {
        request.get('/sliceprofiles')
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    res.body[0].name.should.equal(cfg.sliceprofile.name);
                    res.body[0].settings.should.eql(cfg.sliceprofile.settings);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
