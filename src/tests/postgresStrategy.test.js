const assert = require('assert');
const Postgres = require('./../db/strategies/postgres/Postgres');
const HeroSchema = require('./../db/strategies/postgres/heroSchema');
const Context = require('./../db/strategies/base/ContextStrategy');

let context = {};

const MOCK_CREATE_HERO = {
    name: 'Iron Man',
    power: 'Armor, Technology and Inteligence'
}

const MOCK_UPDATE_HERO = {
    name: 'Batman',
    power: 'Money'
}

describe('Postgres Strategy', () => {
    // this.timeout(Infinity);

    before(async () => {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, HeroSchema);
        context = new Context(new Postgres(connection, model));
        // await context.connect();
        await context.delete();
        await context.create(MOCK_UPDATE_HERO);
    });
    it('Should return if is connected to a Postgres DB', async () => {
        // Arrange ( organize data | setup code )

        // Act ( executes the db query )
        const result = await context.isConnected();

        // Assert ( check if the expected output is equal to real outpu )
        assert.equal(result, true);
    })

    it('Try to create a new Hero', async () => {

        // Arrange ( organize data | setup code )
        const hero = MOCK_CREATE_HERO;

        // Act ( executes the db query )
        // await context.connect();
        const result = await context.create(hero);
        delete result.id;

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(result, hero);
    })

    it('Should list the Hero stored in DB by his name', async () => {

        // Arrange ( organize data | setup code )
        const heroName = MOCK_CREATE_HERO.name;

        // Act ( executes the db query )
        // await context.connect();
        const [result] = await context.read({ name: heroName });
        delete result.id;

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(result, MOCK_CREATE_HERO);
    })

    it('Should update a Hero by his name', async () => {

        // Arrange ( organize data | setup code )
        const heroName = MOCK_UPDATE_HERO.name;

        // Act ( executes the db query )
        const [ heroToBeUpdated ] = await context.read({
            name: heroName
        });
        const newHero = {
            ...MOCK_UPDATE_HERO,
            name: 'Wonder Woman'
        };
        const [updateHero] = await context.update(heroToBeUpdated.id, newHero);
        const [ updatedHero ] = await context.read({
            id: heroToBeUpdated.id
        });

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(updateHero, 1);
        assert.deepEqual(updatedHero.name, newHero.name);
        // NÃO É UMA BOA PRÁTICA
    })

    it('Should delete a Hero by his ID', async () => {

        // Arrange ( organize data | setup code )
        const [ hero ] = await context.read({});

        // Act ( executes the db query )
        const deleteHero = await context.delete(hero.id);

        // Assert ( check if the expected output is equal to real outpu )
        assert.deepEqual(deleteHero, 1);
    })

});
