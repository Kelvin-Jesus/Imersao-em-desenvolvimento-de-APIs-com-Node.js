const assert =  require('assert');
const PasswordHelper = require('./../helpers/PasswordHelper');

// const PASSWORD = '12KaJoTa34';
const PASSWORD = '1234';
const HASH = '$2b$04$ZGpSBsQ6FWkx1WGccKrUbOQWiXGX/NKvapVqJiIiEviezCUy5QPvq';

describe('UserHelper test suite', function() {

    it('Should generate a hash from password', async () => {
        const result = await PasswordHelper.hashPassword(PASSWORD);
        assert.ok(result.length > 10);
    });

    it('Should compare a password and its hash', async () => {
        const result = await PasswordHelper.comparePassword(PASSWORD, HASH);
        // console.log(result.payload);
        assert.ok(result);
    });

});