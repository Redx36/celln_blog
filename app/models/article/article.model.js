module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("articles", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN
        }
    });

    return Article;
};