const { verifySignUp } = require("../../middleware");
const auth = require("../../controllers/user/auth.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRoleExisted
        ],
        auth.signup
    );
    app.post("/api/auth/signin", auth.signin);
    app.post("/api/auth/refreshtoken", auth.refreshToken);
};
