
const { fetchArticles, fetchArticleById } = require("../models/articles");






exports.getArticles = (req,res,next) => {

    fetchArticles().then((result) => {
       res.status(200).send({articles:result});
    }).catch((err) => {
        next(err);
    });
};

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((result) => {
       res.status(200).send({article:result});
    }).catch((err) => {
        next(err);
    });
};


