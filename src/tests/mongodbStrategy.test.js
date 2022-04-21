const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/Mongodb');
const Context = require('../db/strategies/base/ContextStrategy');
const heroSchema = require('../db/strategies/mongodb/heroSchema');

let context = {};

const MOCK_CREATE_HERO = {
    name: 'Iron Man',
    power: 'Armor, Technology and Inteligence'
}

const MOCK_DEFAULT_HERO = {
    name: `Spider Man-${Date.now()}`,
    power: 'Spider Sense'
}

const MOCK_UPDATE_HERO = {
    name: 'Batman',
    power: 'Money'
}

describe('MongoDB Strategy', () => {

    before(async () => {
        const connection = MongoDB.connect();
        context = new Context(new MongoDB(connection, heroSchema));
        await context.create(MOCK_DEFAULT_HERO);
        await context.create(MOCK_UPDATE_HERO);
        // await context.delete();
    });

    it('Should verify if is connected', async () => {

        // Arrange ( organize data | setup code )
        const expected = 'connected';

        // Act ( executes the db query )
        const isConnected = await context.isConnected();

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(isConnected, expected);

    });

    it('Try to create a new Hero', async () => {

        // Arrange ( organize data | setup code )
        const hero = MOCK_CREATE_HERO;

        // Act ( executes the db query )
        // await context.connect();
        const { name, power } = await context.create(hero);

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual({ name, power }, hero);
    })

    it('Should list the Heroes', async () => {

        // Arrange ( organize data | setup code )
        const heroName = MOCK_DEFAULT_HERO.name;

        // Act ( executes the db query )
        const [{ name, power }] = await context.read({ name: heroName });
        const result = { name, power };

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(result, MOCK_DEFAULT_HERO);
    })

    it('Should update a Hero by his name', async () => {

        // Arrange ( organize data | setup code )
        const heroName = MOCK_UPDATE_HERO.name;

        // Act ( executes the db query )
        const [ heroToBeUpdated ] = await context.read({
            name: heroName
        });
        const newHero = {
            _id: heroToBeUpdated._id,
            name: 'Thor',
            power: 'Thunder',
            insertAt: heroToBeUpdated.insertAt,
            __v: heroToBeUpdated.__v,
        };
        const updateHero = await context.update(newHero._id, newHero);
        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(updateHero.modifiedCount, 1);
    })

    it('Should delete a Hero by his ID', async () => {

        // Arrange ( organize data | setup code )
        const [ hero ] = await context.read({});

        // Act ( executes the db query )
        const deleteHero = await context.delete(hero._id);

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(deleteHero.deletedCount, 1);
    })
    // after(async () => {
    //     await context.close();
    // });

});
