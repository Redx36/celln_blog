const { authJwt, verifySignUp } = require("../../middleware");
const users = require("../../controllers/user/user.controller");
const auth = require("../../controllers/user/auth.controller");

module.exports = function(app) {
    const router = require("express").Router();

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/test/all", users.allAccess);
    app.get("/api/test/user", [authJwt.verifyToken], users.clientBoard);
    app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], users.adminBoard);
    app.get("/api/test/super_admin", [authJwt.verifyToken, authJwt.isSuperAdmin], users.superAdminBoard);

    /**
     * @swagger
     * /api/users:
     *   post:
     *      tags:
     *      - Users
     *      description: Create one user
     *      parameters:
     *      - name: username
     *        description: username of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: firstName
     *        description: firstname of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: lastName
     *        description: lastname of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: email
     *        description: email of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: password
     *        description: password of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: role
     *        description: role of the user(client, admin, superAdmin)
     *        in: formData
     *        required: false
     *        type: string
     *      responses:
     *       201:
     *         description: Created
     *
     */
    app.post("/api/users", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRoleExisted], auth.signup);

    /**
     * @swagger
     * /api/users:
     *   get:
     *      tags:
     *      - Users
     *      description: Retrieve all users
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.get("/", users.findAll);

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *      tags:
     *      - Users
     *      description: Retrieve a single user by id
     *      parameters:
     *      - in : path
     *        name: id
     *        description: id of user
     *        required: true
     *        type: integer
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.get("/:id", users.findOne);

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *      tags:
     *      - Users
     *      description: Update a single user by id
     *      parameters:
     *      - name: id
     *        in: path
     *        description: id of user
     *        required: true
     *        type: integer
     *      - name: username
     *        description: username of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: firstName
     *        description: firstname of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: lastName
     *        description: lastname of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: email
     *        description: email of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: password
     *        description: password of the user
     *        in: formData
     *        required: true
     *        type: string
     *      - name: role
     *        description: role of the user(client, admin, superAdmin)
     *        in: formData
     *        required: false
     *        type: string
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.put("/:id", users.update);

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *      tags:
     *      - Users
     *      description: Delete a single user by id
     *      parameters:
     *      - name: id
     *        in: path
     *        description: id of user
     *        required: true
     *        type: integer
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.delete("/:id", users.delete);

    /**
     * @swagger
     * /api/users:
     *   delete:
     *      tags:
     *      - Users
     *      description: Delete all users
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.delete("/", users.deleteAll);

    app.use('/api/users', router);


}
