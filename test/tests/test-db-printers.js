var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/db');
var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Database Printers Api Test Suite', function() {

    it('end point: /printers', function(done) {
        request.get('/printers')
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    res.body[0].name.should.equal(cfg.printer.name);
                    res.body[0].bed.should.eql(cfg.printer.bed);
                    res.body[0].extruders.should.eql(cfg.printer.extruders);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /printers -> NO token', function(done) {
        request.get('/printers')
            .end(function (err, res) {
                if (err) done(err);
                try {
                    //FIXME: currently, the response HTTP Status is 200 but it should be 401
                    //res.should.have.status(401);
                    res.body.status.should.equal(401);
                    res.body.errors.should.equal('No permission');
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
