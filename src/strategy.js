class NotImmplementedException extends Error {
    constructor() {
        super('Not Implemented Exception');
    }
}

class ICrud {
    create(item) {
        throw new NotImmplementedException();
    }

    read(query) {
        throw new NotImmplementedException();
    }

    update(id, item) {
        throw new NotImmplementedException();
    }

    delete(id) {
        throw new NotImmplementedException();
    }
}

class MongoDB extends ICrud {
    constructor() {
        super();
    }

    create(item) {
        console.log('Salvo no mongo');
    }
}

class Postgres extends ICrud {
    constructor() {
        super();
    }

    create(item) {
        console.log('Salvo no postgres');
    }
}

class ContextStrategy extends ICrud {
    constructor(strategy) {
        super();
        this._database = strategy;
    }

    create(item) {
        return this._database.create(item);
    }

    read(item) {
        return this._database.read(item);
    }

    update(id, item) {
        return this._database.update(id, item);
    }

    delete(id) {
        return this._database.delete(id);
    }
}

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();

const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();