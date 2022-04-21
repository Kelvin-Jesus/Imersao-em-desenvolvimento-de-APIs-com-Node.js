const ICrud = require('./../interfaces/ICrud');
const Mongoose = require('mongoose');

class MongoDB extends ICrud {

	constructor(connection, schema) {
	    super();
        this._schema = schema;
        this._connection = connection;
        this.CONNECTION_STATE = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        }
	}

    async create(item) {
		const createHero = await this._schema.create(item);
        return createHero;
	}

    async read(item = {}, skip = 0, limit = 10) {
        return await this._schema.find(item).limit(limit).skip(skip);
    }

    async update(id, item) {
        return await this._schema.updateOne({ _id: id },{$set:item});
    }

    async delete(id) {
        return await this._schema.deleteOne({_id: id});
    }

    async isConnected() {
        // console.log(this.CONNECTION_STATE)
        const currentConnectionState = this.CONNECTION_STATE[this._connection.readyState];
        if ( currentConnectionState === 'connected' ) return currentConnectionState;
        if ( currentConnectionState !== 'connecting' ) return currentConnectionState;

        await new Promise(resolve => setTimeout(resolve, 1000));

        return this.CONNECTION_STATE[this._connection.readyState];
    }

    static connect() {

        Mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, error => {
            if (!error) return;
            console.error('Deu RUIM!', error);
        });
        const connection = Mongoose.connection;
        // connection.once('open', () => console.log('rodando MongoDB'));
        return connection;

    }

    close() {
        return this._connection.close();
    }

}

module.exports = MongoDB;
