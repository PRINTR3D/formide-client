var testUtils = require('../test_modules/test-utils');var request = testUtils.request('/api/auth');var cfg = testUtils.config();var bearerToken = testUtils.bearerToken;var formEncodedContentType = testUtils.formEncodedContentType;var checkPermissions = function checkPermissions(actualPermissions) {    var expectedPermissions = cfg.user.permissions;    (actualPermissions.length).should.equal(expectedPermissions.length);    for (var i = 0; i < actualPermissions.length; i++) {        actualPermissions[i].should.equal(expectedPermissions[i],            'error actual: ' + actualPermissions[i] + ', expected: ' + expectedPermissions[i]);    }};var random = function random(low, high) {    return Math.floor(Math.random() * (high - low) + low);};describe('Authentication Api Test', function() {    var id = cfg.user.id;    var token = cfg.token;    var pattern = new RegExp('^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', 'gi');    it('end point: /session -> should get session info', function(done) {        request.get('/session')            .use(bearerToken)            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.should.be.json;                    res.body.session._id.should.equal(id);                    checkPermissions(res.body.session.permissions);                    res.body.session.token.should.equal(token);                    res.body.session.sessionOrigin.should.equal('local');                    done();                } catch (e) {                    return done(e);                }            });    });    it('end point: /users -> should get users info', function(done) {        request.get('/users')            .use(bearerToken)            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.body[0]._id.should.equal(id);                    res.body[0].email.should.equal(cfg.user.email);                    res.body[0].isAdmin.should.be.true;                    //checkPermissions(res.body[0].permissions);                    done();                } catch (e) {                    done(e);                }            });    });    it('end point: /users/' + id + ' -> should get user info by id', function(done) {        request.get('/users/' + id)            .use(bearerToken)            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.should.be.json;                    res.body._id.should.equal(id);                    res.body.email.should.equal(cfg.user.email);                    res.body.isAdmin.should.be.true;                    done();                } catch (e) {                    done(e);                }            });    });    // Test using a fake ID value    it('end point: /users/0 -> should NOT get users info', function(done) {        request.get('/users/0')            .use(bearerToken)            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.body.should.be.empty;                    done();                } catch (e) {                    done(e);                }            });    });    it('end point: /tokens -> should get user info from token', function(done) {        request.get('/tokens')            .use(bearerToken)            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.body.should.be.array;                    res.body[0].token.should.equal(token);                    res.body[0]._id.should.equal(id);                    res.body[0].sessionOrigin.should.equal('local');                    checkPermissions(res.body[0].permissions);                    done();                } catch (e) {                    done(e);                }            });    });    it('end point: /invite -> should create invited user', function(done) {        var n = random(1,100);        var email = 'test' + n + '@user' + n + '.com';        request.post('/invite')            .use(formEncodedContentType)            .send({ email: email })            .use(bearerToken)            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.should.be.json;                    res.body.success.should.be.true;                    done();                } catch (e) {                    done(e);                }            });    });    /*    it('end point: /invite -> should NOT create duplicate user', function(done) {        request.post('/invite')            .use(formEncodedContentType)            .use(bearerToken)            .send({ email: cfg.user.email })            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.should.be.json;                    res.body.success.should.be.false;                    res.body.error.errmsg.should.equal('Error: duplicate key error index');                    done();                } catch (e) {                    done(e);                }            });    });    */    it('end point: /login -> should authenticate user', function(done) {        request.post('/login')            .use(formEncodedContentType)            .send({ email: cfg.user.email, password: cfg.user.password })            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(200);                    res.should.be.json;                    res.body.success.should.be.true;                    res.body.access_token.should.match(pattern);                    done();                } catch (e) {                    done(e);                }            });    });    it('end point: /login -> should NOT authenticate user', function(done) {        request.post('/login')            .use(formEncodedContentType)            .send({ email: cfg.user.email, password: 'false password' })            .end(function(err, res) {                if (err) done(err);                try {                    res.should.have.status(401);                    done();                } catch (e) {                    done(e);                }            });    });});