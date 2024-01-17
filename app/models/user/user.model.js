const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const db = {};

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.roles = require("../user/role.model.js")(sequelize, Sequelize);
    const User = sequelize.define("users", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Email existant.'
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Email non valide.'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                const hash = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hash);
            },
        },
        roleId: {
            type: Sequelize.INTEGER,
            references: {
                model: db.roles,
                key: 'id'
            }
        }
    });

    return User;
};
