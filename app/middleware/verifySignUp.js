const db = require("../models");
const ROLES = db.ROLES;
const User = db.users;

/**
 * check if username and/or email already exist
 * @param req
 * @param res
 * @param next
 */
const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }
        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }
            next();
        });
    });
};

/**
 * check if role exist
 * @param req
 * @param res
 * @param next
 */
const checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        if (!ROLES.includes(req.body.role)) {
            res.status(400).send({
                message: "Failed! Role does not exist = " + req.body.role
            });
            return;
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRoleExisted: checkRoleExisted
};
module.exports = verifySignUp;
