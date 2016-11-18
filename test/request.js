'use strict';

const request = require('supertest');

function expect(status, params, body) {
    let request = this;

    if (params)
        request = request.query(params);

    if (body)
        request = request.send(body);

    request = request.set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(status);

    return request;
}

const Test = request.Test;

Test.prototype.badRequest = function(params, body) {
    return expect.call(this, 400, params, body);
};

Test.prototype.unauthorized = function(params, body) {
    return expect.call(this, 401, params, body);
};

Test.prototype.notFound = function(params, body) {
    return expect.call(this, 404, params, body);
};

function passthru(literals, ...substitutions) {
    let result = '';
    for (let i = 0; i < substitutions.length; ++i)
        result += literals[i] + substitutions[i];
    result += literals[literals.length - 1];

    return result;
}

function req(server, method, ...args) {
    return request(server)[method](passthru(...args));
}

module.exports = server => {
    global.GET    = (...args) => req(server, 'get',    ...args);
    global.DELETE = (...args) => req(server, 'delete', ...args);
    global.POST   = (...args) => req(server, 'post',   ...args);
    global.PUT    = (...args) => req(server, 'put',    ...args);
};
