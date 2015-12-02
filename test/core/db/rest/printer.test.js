'use strict';

const assert  = require('assert');
const co      = require('co');
const getmac  = require('getmac');
const thenify = require('thenify');
const ENDPOINT = '/api/db/printers';

describe('Printers', function() {

    let $ = null;

    before(done => seed(FormideOS.db).then(_$ => {
        $ = _$;
    }).then(() => done(), done));

    after(done => unseed(FormideOS.db).then(() => done()));

    describe(`GET ${ENDPOINT}`, () => {
        it('should return printers with valid token', done => {

            GET `${ENDPOINT}`
                .query({ access_token: $.accessToken })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(res => {
                    const body = res.body;
                    console.log(body);
                });
        });
    });
});

const seed = co.wrap(_seed);

function* _seed(collections) {

    const user = yield collections.User.create({
        email:    'john@test.com',
        password: 'password'
    });

    const accessToken = yield collections.AccessToken.create({
        createdBy:     user.id,
        permissions:   [],
        sessionOrigin: 'local'
    });

    const userPrinter = yield collections.Printer.create({
        name:         'User printer',
        bed:          { x: 200, y: 200, z: 200, heated: false },
        axis:         { x: 1, y: 1, z: 1 },
        extruders:    [{
            id:         0,
            name:       'Extruder 1',
            nozzleSize: 350
        }],
        port:         null,
        createdBy:    user.id,
        baudrate:     250000,
        gcodeFlavour: 'GCODE_FLAVOR_REPRAP',
        startGcode:   [],
        endGcode:     [],
        type:         'fdm'
    });

    return {
        accessToken:  accessToken.token,
        printer:      printer.id,
        user:         user.id
    }
}

function unseed(collections) {
    assert(collections);

    return collections.accesstoken.destroy()
        .then(() => collections.printer.destroy())
        .then(() => collections.user.destroy());
}

function reseed(collections) {
    assert(collections);

    return unseed(collections).then(() => seed(collections));
}
