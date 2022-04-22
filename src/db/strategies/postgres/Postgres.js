const ICrud = require('./../interfaces/ICrud');
const sequelize = require('sequelize');

class Postgres extends ICrud {
	constructor(connection, schema) {
	    super();
        this._connection = connection;
        this._schema = schema;
	}

	async create(item) {
        const { dataValues } = await this._schema.create(item);
		return dataValues;
	}

    async read(item = {}, skip = 0, limit = 10) {
        return await this._schema.findAll({ 
            where: item, 
            raw: true 
        });
    }

    async update(id, item, upsert = false) {
        const func = upsert ? 'upsert' : 'update';
        return await this._schema[func](item, { 
            where: {
                id: id
            }
         })
    }

    async delete(id) {
        const query = id ? { id } : {};
        return this._schema.destroy({
            where: query
        });
    }

    async isConnected() {

        try {
            await this._connection.authenticate();
            return true;
        } catch (error) {
            console.log('Fail!', error);
            return false;
        }

    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        );
        await model.sync();
        return model;
    }

    static async connect() {

        let sslOption = {};
        if (process.env.SSL_DB == 'true') {
            sslOption.ssl = {
                require: process.env.SSL_DB,
                rejectUnauthorized: false 
            }
        }

        const connection = new sequelize(process.env.POSTGRES_URL, {
            logging: false,
            quoteIdentifiers: false,
            ssl: process.env.SSL_DB,
            dialectOptions: sslOption
        });

        return connection;
    }
}

module.exports = Postgres;
