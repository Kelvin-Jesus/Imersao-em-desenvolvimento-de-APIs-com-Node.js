const ICrud = require('./../interfaces/ICrud');

class ContextStrategy extends ICrud {

    constructor(strategy) {
        super();
        this._database = strategy;
    }

    findAll() {
        return this._database.findAll();
    }

    create(item) {
        return this._database.create(item);
    }

    read(item, skip, limit) {
        return this._database.read(item, skip, limit);
    }

    update(id, item, upsert) {
        return this._database.update(id, item, upsert);
    }

    delete(id) {
        return this._database.delete(id);
    }

    isConnected() {
        return this._database.isConnected();
    }

    static async connect() {
        return this._database.connect();
    }

    close() {
        return this._database.close();
    }

}

module.exports = ContextStrategy;