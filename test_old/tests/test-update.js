var testUtils = require('../test_modules/test-utils');
var request = testUtils.request('/api/update');
//var cfg = testUtils.config();
var bearerToken = testUtils.bearerToken;
//var formEncodedContentType = testUtils.formEncodedContentType;

describe('Update Api Test', function() {

    var author = 'Printr B.V. <info@printr.nl>';
    var githubFOSCRepoUrl = 'https://github.com/PRINTR3D/formideOS-client.git';

    it('end point: /core', function(done) {
        request.get('/core')
            .use(bearerToken)
            .end(function(err, res) {
                if (err) done(err);
                try {
                    res.should.be.json;
                    res.should.have.status(200);
                    res.body.environment.should.equal('production');
                    res.body.port.should.equal(1337);
                    res.body.pkg.name.should.equal('formideos-client');
                    res.body.pkg.author.should.equal(author);
                    res.body.pkg.repository.type.should.equal('git');
                    res.body.pkg.repository.url.should.equal(githubFOSCRepoUrl);
                    res.body.pkg.bugs.url.should.equal(githubFOSCRepoUrl + '/issues');
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('end point: /core/update', function(done) {
       request.get('/core/update')
           .use(bearerToken)
           .end(function(err, res) {
               if (err) done (err);
               try {
                   res.should.have.status(200);
                   res.should.be.json;
                   res.body.success.should.be.true;
                   res.body.message.should.equal('Starting update');
                   done();
                } catch (e) {
                    done(e);
                }
        });
    });

});