// npm i sequelize
// npm i pg-hstore pg

const sequelize = require('sequelize');
const driver = new sequelize(
    'heroes',
    'kj',
    '@Random_1234_Password@',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorAliases: false
    }
);

async function main() {

    const Heroes = driver.define('heroes', {
        id: {
            type: sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize.STRING,
            required: true,
        },
        power: {
            type: sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'TB_HEROES',
        freezeTableName: false,
        timestamps: false
    });

    await Heroes.sync();
    
    // await Heroes.create({
    //     name: 'Lanterna Verde',
    //     power: 'Green Ring Energy'
    // });

    const result = await Heroes.findAll({ raw: true });
    const resultWithAttributes = await Heroes.findAll({ 
        raw: true,
        attributes: [ 'name' ]
    });
    console.log(resultWithAttributes);

}

main();