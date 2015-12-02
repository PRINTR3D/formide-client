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
        it('should return printers', () => GET `${ENDPOINT}`
            .query({ access_token: $.accessToken })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                const body = res.body;

                assert.strictEqual(body.length, 1);
                for (const printer of body) {
                    assert(printer.createdAt);
                    assert(printer.updatedAt);

                    // delete generated columns before validation
                    delete printer.createdAt;
                    delete printer.updatedAt;

                    if (printer.device)
                        delete printer.device;

                    if (printer.children)
                        delete printer.children;

                    if (printer.parent) {
                        assert.strictEqual(printer.parent.id, $.userPrinter);
                        delete printer.parent;
                    }

                    if (printer.materials)
                        delete printer.materials;

                    if (printer.sliceProfiles)
                        delete printer.sliceProfiles;
                }
            })
            .expect(200, [{
                // createdAt: { GENERATED }
                // updatedAt: { GENERATED }
                createdBy:     $.user,
                id:            $.printer,
                name:          'User printer',
                bed:           { x: 200, y: 200, z: 200, heated: false },
                axis:          { x: 1, y: 1, z: 1 },
                port:          null,
                baudrate:      250000,
                gcodeFlavour:  'GCODE_FLAVOR_REPRAP',
                startGcode:    [],
                endGcode:      [],
                type:          'fdm',

                extruders: [{
                    id:         0,
                    name:       'Extruder 1',
                    nozzleSize: 350
                }],
            }]));
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

    const printer = yield collections.Printer.create({
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

    return collections.AccessToken.destroy()
        .then(() => collections.Printer.destroy())
        .then(() => collections.User.destroy());
}

function reseed(collections) {
    assert(collections);

    return unseed(collections).then(() => seed(collections));
}
