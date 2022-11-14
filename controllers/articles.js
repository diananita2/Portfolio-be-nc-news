const { fetchArticles } = require("../models/articles");

exports.getArticles = (req,res,next) => {

    fetchArticles().then((result) => {
       res.status(200).send({articles:result});
    }).catch((err) => {
        next(err);
    });
};