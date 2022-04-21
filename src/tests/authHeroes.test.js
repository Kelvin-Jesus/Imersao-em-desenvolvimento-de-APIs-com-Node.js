const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/ContextStrategy');
const Postgres = require('./../db/strategies/postgres/Postgres');

const UserSchema = require('./../db/strategies/postgres/userSchema');

let app = {};
const USER = {
    username: 'jk',
    password: '1234'
};

const DB_USER = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$ZGpSBsQ6FWkx1WGccKrUbOQWiXGX/NKvapVqJiIiEviezCUy5QPvq'
};

describe('Auth test suite', function() {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await Postgres.connect();
        const model = await Postgres.defineModel(connectionPostgres, UserSchema);
        const context = new Context(new Postgres(connectionPostgres, model));
        await context.update(null, DB_USER, true);
    })

    it('Should receive a token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(data.token.length > 10);

    });

    it('Should not log a non existent user', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'kj',
                password: '40j93t'
            }
        });

        const data = JSON.parse(result.payload);

        assert.deepEqual(result.statusCode, 401);
        assert.deepEqual(data.error, "Unauthorized");
    });

});