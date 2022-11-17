
const { fetchArticles, fetchArticleById, updateArticleById } = require("../models/articles");

exports.getArticles = (req,res,next) => {
    const {topic,sort_by,order} = req.query;
       fetchArticles(topic,sort_by,order).then((result) => {
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

exports.patchArticleById = (req,res,next) => {
    const {article_id} = req.params;
    const articleUpdates = req.body;
    if(typeof(Object.values(articleUpdates)[0]) != 'number'){
        res.status(400).send({msg:'invalid datatype'});
    }
    updateArticleById(article_id,articleUpdates).then((result) => {
       res.status(200).send({article:result});
    }).catch((err) => {
        next(err);
    });
};


