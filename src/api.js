// npm i hapi
// npm i hapi-swagger@9.1.3
// npm i jsonwebtoken
// npm i hapi-auth-jwt2
// npm i bcrypt
// npm i dotenv
// npm i -g heroku

const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok( env === 'prod' || env === 'dev', 'env is invalid, choose dev or prod' );

const configPath = join(__dirname, './../config/', `.env.${env}`);
config({
    path: configPath
});

const Hapi = require('hapi');

const Context = require('./db/strategies/base/ContextStrategy');
const MongoDB = require('./db/strategies/mongodb/Mongodb');
const HeroSchema = require('./db/strategies/mongodb/heroSchema');
const Postgres = require('./db/strategies/postgres/Postgres');
const UserSchema = require('./db/strategies/postgres/userSchema');

const HeroRoutes = require('./routes/HeroRoutes');
const AuthRoutes = require('./routes/AuthRoutes');

const Vision = require('vision');
const Inert = require('inert');
const hapiSwagger = require('hapi-swagger');

const HapiJwt = require('hapi-auth-jwt2');
const JWT_SECRET = process.env.JWT_KEY;

const app = new Hapi.Server({
    port: process.env.PORT
});

const mapRoutes = (instance, methods) => {
    return methods.map(method => instance[method]());
}

async function main() {

    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroSchema));

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UserSchema);
    const contextPostgres = new Context(new Postgres(connectionPostgres, model));

    const swaggerOptions = {
        info: {
            title: 'API Heroes - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: hapiSwagger,
            options: swaggerOptions
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 200
        // },
        validate: async (data, request) => {
            // const [ result ] = await contextPostgres.read({
            //     username: data.username.toLowerCase(),
            //     id: data.id
            // });
            // if ( !result ) {
            //     return { isValid: false }
            // }
            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');
    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
    ]);

    const USER = {
        username: 'jk',
        password: '1234'
    };

    const result = await app.inject({
        url: '/login',
        method: 'POST',
        payload: USER
    });

    return console.log(JSON.parse(result.payload));

    await app.start();
    console.log(`🔥Server Running on Port🔥: ${app.info.port}`);

    return app;
};

module.exports = main();