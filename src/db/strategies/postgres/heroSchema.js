const sequelize = require('sequelize');

const HeroSchema = {
    name: 'heroes',
    schema: {
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
    },
    options: {
        tableName: 'TB_HEROES',
        freezeTableName: false,
        timestamps: false
    }
};

module.exports = HeroSchema;