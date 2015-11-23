var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/files');
//var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
var formEncodedContentType = testUtils.formEncodedContentType;
var touch = require('touch');
var path = require('path');
var fs = require('fs');


describe('Files Api Test (upload)', function() {
    var uploadApiEndpoint = '/upload';
    var size = 1;
    var filenames = [
        'file.' + size + '.stl',
        'file.' + size + '.gcode',
        'file.' + size + '.crap'
    ];
    var hashRegexp = new RegExp('^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', 'gi');

    before(function() {
        filenames.forEach(function(file) {
            touch.sync(file, '');
        })
    });

    after(function() {
       filenames.forEach(function (file) {
           try {
               fs.unlinkSync(file);
           } catch(e) { /* ignored */ }
       })
    });

    it('end point: /upload -> should upload a STL file', function(done) {
        var filename = filenames[0];
        request.post(uploadApiEndpoint)
            .use(bearerToken)
            .use(formEncodedContentType)
            .attach('file', filename)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.success.should.be.true;
                    res.body.modelfile.filename.should.equal('test.stl');
                    res.body.modelfile.filesize.should.equal(size);
                    res.body.modelfile.filetype.should.equal(path.extname(filename).replace('.', ''));
                    res.body.modelfile.hash.should.match(hashRegexp);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /upload -> should upload a GCODE file', function(done) {
        var filename = filenames[1];
        request.post(uploadApiEndpoint)
            .use(bearerToken)
            .use(formEncodedContentType)
            .attach('file', filename)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.success.should.be.true;
                    res.body.gcodefile.filename.should.equal(filename);
                    res.body.gcodefile.filesize.should.equal(size);
                    /*
                     res.body.gcodefile.hash.should.match(
                     /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi);
                     */
                    res.body.gcodefile.hash.should.match(hashRegexp);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /upload -> should NOT upload this file', function(done) {
        var filename = filenames[2];
        request.post(uploadApiEndpoint)
            .use(bearerToken)
            .use(formEncodedContentType)
            .attach('file', filename)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.success.should.be.false;
                    res.body.should.have.property('message');
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /upload -> should handle a request with no file', function(done) {
        request.post(uploadApiEndpoint)
            .use(bearerToken)
            .use(formEncodedContentType)
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.success.should.be.false;
                    res.body.should.have.property('message');
                    done();
                } catch (e) {
                    done(e);
                }
        });
    });

    it('end point: /upload/url -> should upload a STL file from an URL', function(done) {
        request.post(uploadApiEndpoint)
            .use(bearerToken)
            .use(formEncodedContentType)
            .set('url', 'https://www.thingiverse.com/download:1510835')
            .set('filename', 'test.stl')
            .set('filetype', 'stl')
            .end(function (err, res) {
                if (err) done(err);
                try {
                    res.should.have.status(200);
                    //res.should.be.json;
                    res.body.success.should.be.true;
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
