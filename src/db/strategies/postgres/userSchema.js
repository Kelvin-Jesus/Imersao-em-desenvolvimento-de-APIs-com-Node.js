const sequelize = require('sequelize');

const UserSchema = {
    name: 'users',
    schema: {
        id: {
            type: sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: sequelize.STRING,
            unique: true,
            required: true,
        },
        password: {
            type: sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'TB_USERS',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = UserSchema;