const assert = require('assert');
const api = require('./../api');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwiaWQiOjEsImlhdCI6MTY1MDQ2NDk3OX0.uLSMNC6jwSNNRtouKqcomztFOPm7SSMT6ovC3dDdWvA';

const headers = {
    Authorization: TOKEN
}

const MOCK_CREATE_HERO = {
    name: 'Chapolin',
    power: 'Marreta Biônica'
};

const MOCK_UPDATE_HERO = {
    name: 'Hawkman',
    power: 'defy gravity'
};

let app;
let MOCK_ID;
describe('API Heroes tests', async function() {
    this.beforeAll(async ()=>{
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            headers,
            payload: JSON.stringify(MOCK_UPDATE_HERO)
        });
        MOCK_ID = JSON.parse(result.payload).hero._id;
    });

    it('list GET /heroes', async () => {

        // Pretend to be a USER makin' a request
        const request = await app.inject({
            method:'GET',
            headers,
            url: '/heroes'
        });
        
        // Parse the payload response to JSON
        const data = JSON.parse(request.payload);
        const statusCode = request.statusCode;

        // test if statusCode is 200 and if data is an array
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));

    });

    it('list GET /heroes should filter a hero by his name', async () => {
        const LIMIT = 1000;
        const NAME = MOCK_UPDATE_HERO.name;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/heroes?skip=0&limit=${LIMIT}&name=${NAME}`
        })

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.deepEqual(data[0].name, NAME);
    });

    it('Create POST /heroes should create a new hero', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            headers,
            payload: MOCK_CREATE_HERO
        });

        const payload = JSON.parse(result.payload);

        assert.ok(result.statusCode === 200);
        assert.deepEqual(payload.hero.name, MOCK_CREATE_HERO.name);
    });

    it('Update PATCH /heroes/:id should update a hero', async () => {

        const heroToBeUpdatedId = MOCK_ID;
        const expected = {
            power: 'scope'
        };
        const updateHero = await app.inject({
            method: 'PATCH',
            headers,
            url: `/heroes/${heroToBeUpdatedId}`,
            payload: JSON.stringify(expected)
        });

        const data = JSON.parse(updateHero.payload);

        assert.ok(updateHero.statusCode === 200);
        assert.deepEqual(data.message, 'Hero updated!');

    });

    it('Update PATCH /heroes/:id should not update a hero with incorrect id', async () => {

        const heroToBeUpdatedId = `625ebf348778e4f33f2ef63b`;
        const expected = {
            power: 'scope'
        };
        const updateHero = await app.inject({
            method: 'PATCH',
            headers,
            url: `/heroes/${heroToBeUpdatedId}`,
            payload: JSON.stringify(expected)
        });

        const data = JSON.parse(updateHero.payload);
        // assert.ok(updateHero.statusCode === 412);
        assert.deepEqual(data.message, 'Hero not found');

    });

    it('Delete DELETE /heroes/:id should delete a hero by id', async () => {
        const idOfHeroToBeDeleted = MOCK_ID;
        const deleteHero = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${idOfHeroToBeDeleted}`
        });

        const data = JSON.parse(deleteHero.payload);

        assert.ok(deleteHero.statusCode === 200);
        assert.deepEqual(data.message, 'Hero deleted!');
    });

    it('Delete DELETE /heroes/:id should not delete a hero', async () => {
        const idOfHeroToBeDeleted = '625ebf348778e4f33f2ef63b';
        const deleteHero = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${idOfHeroToBeDeleted}`
        });

        const data = JSON.parse(deleteHero.payload);
        const expected = 'Hero not found';

        // assert.ok(deleteHero.statusCode === 412);
        assert.deepEqual(data.message, expected);
    });

});