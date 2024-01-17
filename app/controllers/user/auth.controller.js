const db = require("../../models");
const config = require("../../config/auth.config");
const { users: User, roles: Role, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * function to manage signup of users
 * @param req
 * @param res
 */
exports.signup = async (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 8),
    })
        .then(user => {
            if (req.body.role) {
                Role.findOne({
                    where: {
                        name: {
                            [Op.eq]: req.body.role
                        }
                    }
                }).then(role => {
                    user.setRole(role).then(() => {
                        res.status(200).send({ message: "User was registered successfully!" });
                    });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
            } else {
                Role.findOne({
                    where: {
                        name: {
                            [Op.eq]: 'client'
                        }
                    }
                }).then(role => {
                    user.setRole(role).then(() => {
                        res.status(200).send({ message: "User was registered successfully!" });
                    });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

/**
 * function to sign users in
 * @param req
 * @param res
 */
exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(async user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            const passwordIsValid = bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration // 24 hours
            });
            let refreshToken = await RefreshToken.createToken(user);
            user.getRole().then(role => {
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: role.name.toUpperCase(),
                    accessToken: token,
                    refreshToken: refreshToken,
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
        console.log(refreshToken)
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }
        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
