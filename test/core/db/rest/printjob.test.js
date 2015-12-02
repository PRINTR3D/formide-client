'use strict';

const assert  = require('assert');
const co      = require('co');
const getmac  = require('getmac');
const thenify = require('thenify');

const ENDPOINT = '/api/db/printjobs';

describe('PrintJobs', function() {

    let $ = null;

    before(done => seed(FormideOS.db).then(_$ => {
        $ = _$;
    }).then(() => done(), done));

    after(done => unseed(FormideOS.db).then(() => done()));

    // describe(`GET ${ENDPOINT}`, () => {
    //     it('should return printJobs', () => GET `${ENDPOINT}`
    //         .query({ access_token: $.accessToken })
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(res => {
    //             const body = res.body;
    //
    //             assert.strictEqual(body.length, 1);
    //             for (const printJob of body) {
    //                 assert(printJob.createdAt);
    //                 assert(printJob.updatedAt);
    //                 assert(printJob.createdBy);
    //
    //                 // delete generated columns before validation
    //                 delete printJob.createdAt;
    //                 delete printJob.updatedAt;
    //                 delete printJob.createdBy;
    //             }
    //         })
    //         .expect(200, [{
    //             // createdAt: { GENERATED }
    //             // updatedAt: { GENERATED }
    //             // createdBy:
    //             id:             $.printJob,
    //
    //         }]));
    // });
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
        createdBy:     user.id
    });

    const printer = yield collections.Printer.create({
        createdBy:     user.id
    });

    const sliceProfile = yield collections.SliceProfile.create({
        name:           'User sliceprofile',
        settings:       {},
        createdBy:      user.id
    });

    const file = yield collection.UserFile.create({
        createdBy:      user.id
    });

    const printJob = yield collections.PrintJob.create({
        createdBy:      user.id,
        materials:      [material.id],
        printer:        printer.id,
        sliceProfile:   sliceProfile.id,
        files:          [file.id],
        sliceRequest:   {},
        sliceSettings:  {},
        sliceFinished:  false
    });

    return {
        accessToken:  accessToken.token,
        sliceProfile: sliceProfile.id,
        material:     material.id,
        printer:      printer.id,
        file:         file.id,
        printJob:     printJob.id,
        user:         user.id
    }
}

function unseed(collections) {
    assert(collections);

    return collections.AccessToken.destroy()
        .then(() => collections.SliceProfile.destroy())
        .then(() => collections.Material.destroy())
        .then(() => collections.Printer.destroy())
        .then(() => collections.PrintJob.destroy())
        .then(() => collections.UserFile.destroy())
        .then(() => collections.User.destroy());
}

function reseed(collections) {
    assert(collections);

    return unseed(collections).then(() => seed(collections));
}
