'use strict';

const assert  = require('assert');
const co      = require('co');
const getmac  = require('getmac');
const thenify = require('thenify');

const ENDPOINT = '/api/db/materials';

describe('Materials', function() {

    let $ = null;

    before(done => seed(FormideOS.db).then(_$ => {
        $ = _$;
    }).then(() => done(), done));

    after(done => unseed(FormideOS.db).then(() => done()));

    describe(`GET ${ENDPOINT}`, () => {
        it('should return materials', () => GET `${ENDPOINT}`
            .query({ access_token: $.accessToken })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                const body = res.body;

                assert.strictEqual(body.length, 1);
                for (const material of body) {
                    assert(material.createdAt);
                    assert(material.updatedAt);
                    assert(material.createdBy);

                    // delete generated columns before validation
                    delete material.createdAt;
                    delete material.updatedAt;
                    delete material.createdBy;
                }
            })
            .expect(200, [{
                // createdAt: { GENERATED }
                // updatedAt: { GENERATED }
                // createdBy:
                id:                         $.material,
                name:                       'User material',
                type:                       'PLA',
                temperature:                200,
                firstLayersTemperature:     210,
                bedTemperature:             50,
                firstLayersBedTemperature:  60,
                feedRate:                   100,
                filamentDiameter:           1750,
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

    const material = yield collections.Material.create({
        name:                       'User material',
        type:                       'PLA',
        temperature:                200,
        firstLayersTemperature:     210,
        bedTemperature:             50,
        firstLayersBedTemperature:  60,
        feedRate:                   100,
        filamentDiameter:           1750,
        createdBy:                  user.id
    });

    return {
        accessToken:  accessToken.token,
        material:     material.id,
        user:         user.id
    }
}

function unseed(collections) {
    assert(collections);

    return collections.AccessToken.destroy()
        .then(() => collections.Material.destroy())
        .then(() => collections.User.destroy());
}

function reseed(collections) {
    assert(collections);

    return unseed(collections).then(() => seed(collections));
}
