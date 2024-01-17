const db = require("../../models");
const User = db.users;
const Role = db.roles;
const RefreshToken = db.refreshToken
const Op = db.Sequelize.Op;
var bcrypt = require("bcrypt");


const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    //return totalItems;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
};

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a User
    const user = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    };
    // Save User in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const { page, size, email } = req.query;
    var condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    User.findAndCountAll({ where: condition, order: [['id', 'DESC']], include:[
            { model: Role, as:'role'},
            { model: RefreshToken, as:'refresh_token'}
        ], limit, offset, distinct: true })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id, { include:[
            { model: Role, as:'role'},
            { model: RefreshToken, as:'refresh_token'}
        ], distinct: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id,
                error: err
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
                    num: num
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.clientBoard = (req, res) => {
    //res.status(200).send("Client Content.");
};
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
exports.superAdminBoard = (req, res) => {
    res.status(200).send("Super Admin Content.");
};

