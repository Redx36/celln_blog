const { authJwt } = require("../../middleware");
const articles = require("../../controllers/article/article.controller");

module.exports = function(app) {
    const router = require("express").Router();

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * @swagger
     * /api/articles:
     *   post:
     *      tags:
     *      - Articles
     *      description: Create one article
     *      parameters:
     *      - name: title
     *        description: title of the article
     *        in: formData
     *        required: true
     *        type: string
     *      - name: description
     *        description: description of the article
     *        in: formData
     *        required: true
     *        type: string
     *      - name: published
     *        description: status of the article
     *        in: formData
     *        required: false
     *        type: boolean
     *      security:
     *       - JWT: []
     *      responses:
     *       201:
     *         description: Created
     *
     */
    router.post("/", articles.create);

    /**
     * @swagger
     * /api/articles:
     *   get:
     *      tags:
     *      - Articles
     *      description: Retrieve all articles
     *      security:
     *       - JWT: []
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.get("/", articles.findAll);

    /**
     * @swagger
     * /api/articles/{id}:
     *   get:
     *      tags:
     *      - Articles
     *      description: Retrieve a single article by id
     *      parameters:
     *      - in : path
     *        name: id
     *        description: id of article
     *        required: true
     *        type: integer
     *      security:
     *       - JWT: []
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.get("/:id", articles.findOne);

    /**
     * @swagger
     * /api/articles/{id}:
     *   put:
     *      tags:
     *      - Articles
     *      description: Create one article
     *      parameters:
     *      - name: title
     *        description: title of the article
     *        in: formData
     *        required: true
     *        type: string
     *      - name: description
     *        description: description of the article
     *        in: formData
     *        required: true
     *        type: string
     *      - name: published
     *        description: status of the article
     *        in: formData
     *        required: false
     *        type: boolean
     *      security:
     *       - JWT: []
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.put("/:id", articles.update);

    /**
     * @swagger
     * /api/articles/{id}:
     *   delete:
     *      tags:
     *      - Articles
     *      description: Delete a single article by id
     *      parameters:
     *      - name: id
     *        in: path
     *        description: id of article
     *        required: true
     *        type: integer
     *      security:
     *       - JWT: []
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.delete("/:id", articles.delete);

    /**
     * @swagger
     * /api/recipes:
     *   delete:
     *      tags:
     *      - Articles
     *      description: Delete all articles
     *      security:
     *       - JWT: []
     *      responses:
     *       200:
     *         description: Success
     *
     */
    router.delete("/", articles.deleteAll);

    app.use('/api/articles', [authJwt.verifyToken], router);


}
