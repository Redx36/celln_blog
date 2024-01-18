const dbConfig = require("../config/db.config.js");
const dotenv = require('dotenv');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user/user.model.js")(sequelize, Sequelize);
db.roles = require("./user/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("./user/refreshToken.model.js")(sequelize, Sequelize);
db.articles = require("./article/article.model.js")(sequelize, Sequelize);




//role block
db.users.belongsTo(db.roles, {
    foreignKey: "roleId",
    as: "role",
});
db.roles.hasMany(db.users, { as: "users" });


//refresh token block
db.refreshToken.belongsTo(db.users, {
    foreignKey: 'userId', targetKey: 'id'
});
db.users.hasOne(db.refreshToken, {
    foreignKey: 'userId', targetKey: 'id'
});

db.ROLES = ["client", "admin", "superAdmin"];

module.exports = db;
