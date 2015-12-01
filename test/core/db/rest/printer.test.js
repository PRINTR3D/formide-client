'use strict';

const assert  = require('assert');
const co      = require('co');
const getmac  = require('getmac');
const thenify = require('thenify');

const ENDPOINT = '/api/db/printers';
const ACCESS_TOKEN = '';

describe('Printers', function() {
    this.slow(500);

    let $ = null;

    describe(`GET ${ENDPOINT}`, () => {
        it('should return printers with valid token', done => {

            GET `${ENDPOINT}`
                .query({ access_token: ACCESS_TOKEN })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(res => {
                    const body = res.body;
                    console.log(body);
                });
        });
    });
});
