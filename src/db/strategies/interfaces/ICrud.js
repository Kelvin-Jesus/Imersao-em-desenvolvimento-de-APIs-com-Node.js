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

    update(id, item, upsert) {
        throw new NotImmplementedException();
    }

    delete(id) {
        throw new NotImmplementedException();
    }

    isConnected() {
        throw new NotImmplementedException();
    }
    connect() {
        throw new NotImmplementedException();
    }
}

module.exports = ICrud;