var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/files');
var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Files Api Test (download)', function() {

    //var file;
    //var useFile;

    /*
    beforeEach(function () {
        useFile = false;
    });
    */

    /*
    afterEach( function() {
        try {
            fs.unlinkSync(file);
        } catch (e) { }
    });*/

    it('end point: /modelfiles/download -> should NOT download a STL file', function(done) {
        request.get('/modelfiles/download')
            .query({ hash: '0', encoding: 'utf8' })
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.be.status(200);
                    res.body.should.be.empty;
                    //res.text.should.equal('file not found');
                    //console.dir(res);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /modelfiles/download -> should download a STL file', function(done) {
        var hash = cfg.modelfile.hash;
        //console.log(hash);
        request.get('/modelfiles/download')
            .query({ hash: hash, encoding: 'utf8' })
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.be.status(200);
                    res.type.should.equal('application/octet-stream');
                    //console.dir(res);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /gcodefiles/download -> should NOT download a GCODE file', function(done) {
        request.get('/gcodefiles/download')
            .query({ hash: '0', encoding: 'utf8' })
            .use(bearerToken)
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

    /*

    it('end point: /gcodefiles/download -> should download a GCODE file', function(done) {
        request.get('/gcodefiles/download')
            .query({ hash: 0, encoding: 'utf8' })
            .use(bearerToken)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.be.status(200);
                    res.type.should.equal('application/octet-stream');
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    */

});
