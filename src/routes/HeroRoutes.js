const Joi = require("joi");
// const Boom = require('@hapi/boom');
const BaseRoute = require("./base/baseRoute");

class HeroRoutes extends BaseRoute {
    
    constructor(db) {
        super();
        this.db = db;
    }

    _headers() { 
        return Joi.object({
            authorization: Joi.string().required()
        }).unknown();
    }

    _failAction(request, header, erro) {
        throw erro;
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve listar os heróis',
                notes: 'Pode paginar resultados e filtrar por nome',
                validate: {
                    failAction: this._failAction,
                    headers: this._headers(),
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(100),
                        name: Joi.string().min(3).max(100)
                    },
                }
            },
            handler: async (request, headers) => {
                try {
                    let { skip, limit, name } = request.query;
                    
                    let query = {name: {$regex: `.*${name || ""}*.`}};

                    return await this.db.read(name ? query : {}, skip, limit);

                } catch (error) {
                    console.log('Deu RUIM', error);
                    return error;
                }
            }
        };
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar herói',
                notes: 'Cadastrar herói com nome e poder',
                validate: {
                    failAction: this._failAction,
                    headers: this._headers(),
                    payload: {
                        name: Joi.string().required().min(3).max(100),
                        power: Joi.string().required().min(2).max(100)
                    }
                }
            },
            handler: async request => {
                try {
                    const { name, power } = request.payload;
                    const createHero = await this.db.create({
                        name, 
                        power
                    });

                    return {
                        message: 'Hero created!',
                        hero: createHero
                    }
                } catch (error) {
                    console.log('DEU RUIM', error);
                    return error;
                }
            }
        }; 
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar os heróis',
                notes: 'Atualiza um campo de um herói',
                validate: {
                    failAction: this._failAction,
                    headers: this._headers(),
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        name: Joi.string().min(3).max(100),
                        power: Joi.string().min(3).max(100),
                    }
                }
            },
            handler: async request => {
                try {
                    const { id } = request.params;
                    const { payload } = request;

                    const dataString = JSON.stringify(payload);
                    const data = JSON.parse(dataString);

                    const result = await this.db.update(id, data);

                    if ( result.modifiedCount !== 1 ) return {message: 'Hero not found'};

                    return {
                        message: 'Hero updated!',
                        hero: result
                    }

                } catch (error) {
                    console.error('DEU RUIM!', error);
                    return error;
                }
            }
        }
    }

    delete() {
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve deletar um herói',
                notes: 'Deleta um herói pelo id',
                validate: {
                    failAction: this._failAction,
                    headers: this._headers(),
                    params: {
                        id: Joi.string().required()
                    } 
                }
            },
            handler: async request => {

                try {
                    
                    const { id } = request.params;
                    const result = await this.db.delete(id);
                    
                    if ( result.deletedCount !== 1 ) return {message: 'Hero not found'}

                    return {
                        message: 'Hero deleted!'
                    };

                } catch (error) {
                    console.error('DEU RUIM', error);
                    return error;
                }

            }
        }
    }

}

module.exports = HeroRoutes;