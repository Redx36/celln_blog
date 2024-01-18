const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const robots = require("express-robots-txt");
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require("cors");
require("dotenv").config();

const app = express();

var corsOptions = {
    origin: process.env.FRONT_URL || "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
app.use(bodyParser.json());
app.use(multer().any());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// load files
app.use('/public', express.static("public"));

//all models
const db = require("./app/models");
const Role = db.roles;
db.sequelize.sync();
//  db.sequelize.sync({force: true}).then(() =>{
//      initial();
//  });

// add robots
app.use(robots({
    UserAgent: '*',
    Disallow: '/'
}))

//every api routes
require('./app/routes')(app);


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the backend REST API application." });
});

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Cell\'N Blog API",
            version: '1.0.0',
            description: 'Describing a RESTful API with Swagger',
        },
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                description: 'JWT authorization of an API',
                name: 'x-access-token',
                in: 'header',
            },
        },
        security: [{
            JWT: []
        }]
    },
    apis: ["server.js", "./app/routes/*/*.routes.js", "./app/routes/*.routes.js"],
};

//swagger doc
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// set port, listen for requests
const PORT = process.env.BACKEND_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});



function initial() {
    Role.create({
        id: 1,
        name: "client"
    });

    Role.create({
        id: 2,
        name: "admin"
    });

    Role.create({
        id: 3,
        name: "superAdmin"
    });

}