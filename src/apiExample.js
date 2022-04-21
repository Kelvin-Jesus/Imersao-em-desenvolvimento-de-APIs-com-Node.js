// npm i hapi

const Hapi = require('hapi');
const Context = require('./db/strategies/base/ContextStrategy');
const MongoDB = require('./db/strategies/mongodb/Mongodb');
const HeroSchema = require('./db/strategies/mongodb/heroSchema');

const app = new Hapi.Server({
    port: 5000
});

async function main() {

    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroSchema));

    app.route([
        {
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                return context.read();
            }
        }
    ]);

    await app.start();
    console.log(`🔥Server Running on Port🔥: ${app.info.port}`);

};

main();