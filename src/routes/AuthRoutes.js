const Joi = require("joi");
const Jwt = require('jsonwebtoken');
const Boom = require('boom');

const BaseRoute = require("./base/baseRoute");
const PasswordHelper = require('./../helpers/PasswordHelper');

const USER = {
    username: 'jk',
    password: '1234'
}

class AuthRoutes extends BaseRoute {

    constructor(secret, db) {
        super();
        this.secret = secret;
        this.db = db;
    }

    _failAction(request, header, erro) {
        throw erro;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter um token JWT',
                notes: 'Loga o usuário',
                validate: {
                    failAction: this._failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {

                console.log(request);
                
                const { username, password } = request.payload;
                console.log(await this.db.read({
                    username: username.toLowerCase()
                }))
                
                const [ user ] = await this.db.read({
                    username: username.toLowerCase()
                });

                if ( !user ) {
                    return Boom.unauthorized('User not found!');
                }

                const match = await PasswordHelper.comparePassword(password, user.password);

                if ( !match ) {
                    return Boom.unauthorized('User or Password is invalid');
                }
                    
                const token = Jwt.sign({
                    username: username,
                    id: user.id
                }, this.secret);

                return {
                    token
                }
            }
        }
    }

}

module.exports = AuthRoutes;