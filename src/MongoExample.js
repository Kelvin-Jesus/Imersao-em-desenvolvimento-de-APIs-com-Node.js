// npm i mongoose

const Mongoose = require('mongoose');
Mongoose.connect('mongodb://admin:100senha@localhost:27017/admin', { useNewUrlParser: true }, error => {
    if (!error) return;
    console.error('Deu RUIM!', error);
});

const connection = Mongoose.connection;
connection.once('open', () => console.log('rodando'));
// setTimeout(()=>{
//     const currentState = connection.readyState;
//     console.log('State:', currentState)
// }, 2000) CHECK IF IS CONNECTED

// 0: disconnected
// 1: connected
// 2: connecting
// 3: disconnecting

const heroSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: String,
        required: true
    },
    insertAt: {
        type: Date,
        default: new Date()
    }
});

const model = Mongoose.model('heroes', heroSchema);

async function main() {
    const create = await model.create({
        name: 'Batman',
        power: 'Money'
    });

    console.log(create);

    const listItems = await model.find();
    console.log(listItems);
}

main();