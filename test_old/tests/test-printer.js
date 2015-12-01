var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/printer');
//var cfg = testUtils.config();
//var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Printer Api Test ', function() {

    it('end point: /', function(done) {
        request.get('/')
            //.use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.be.status(200);
                    res.body.should.be.empty;
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /0/fake -> fake port, fake printer command', function(done) {
        request.get('/0/fake')
            //.use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.be.status(200);
                    res.should.be.json;
                    res.body.success.should.be.false;
                    res.body.message.should.equal('No printer on connected on this port');
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
