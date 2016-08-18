'use strict';

const assert  = require('assert');
const co      = require('co');
const getmac  = require('getmac');
const thenify = require('thenify');

const ENDPOINT = '/api/db/sliceprofiles';

describe('SliceProfiles', function() {

    let $ = null;

    before(done => seed(FormideClient.db).then(_$ => {
        $ = _$;
    }).then(() => done(), done));

    after(done => unseed(FormideClient.db).then(() => done()));

    describe(`GET ${ENDPOINT}`, () => {
        it('should return sliceProfiles', () => GET `${ENDPOINT}`
            .query({ access_token: $.accessToken })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                const body = res.body;

                assert.strictEqual(body.length, 1);
                for (const sliceProfile of body) {
                    assert(sliceProfile.createdAt);
                    assert(sliceProfile.updatedAt);
                    assert(sliceProfile.createdBy);

                    // delete generated columns before validation
                    delete sliceProfile.createdAt;
                    delete sliceProfile.updatedAt;
                    delete sliceProfile.createdBy;
                }
            })
            .expect(200, [{
                // createdAt: { GENERATED }
                // updatedAt: { GENERATED }
                // createdBy:
                id:             $.sliceProfile,
                name:           'User sliceprofile',
                settings:       {}
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

    const sliceProfile = yield collections.SliceProfile.create({
        name:           'User sliceprofile',
        settings:       {},
        createdBy:      user.id
    });

    return {
        accessToken:  accessToken.token,
        sliceProfile: sliceProfile.id,
        user:         user.id
    }
}

function unseed(collections) {
    assert(collections);

    return collections.AccessToken.destroy()
        .then(() => collections.SliceProfile.destroy())
        .then(() => collections.User.destroy());
}

function reseed(collections) {
    assert(collections);

    return unseed(collections).then(() => seed(collections));
}
