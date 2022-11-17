const { addCommentsToArticleId, fetchCommentsByArticleId, removeComment } = require("../models/comments");

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params;
  
    fetchCommentsByArticleId(article_id).then((result) => {
        res.status(200).send({comments:result});
    }).catch((err) => {
        next(err);
    });
};

exports.postCommentsToArticleId = (req,res,next) => {
    const {article_id} = req.params;
    const newComment = req.body;
    addCommentsToArticleId(article_id,newComment).then((result) => {
        res.status(201).send({comment:result});
    }).catch((err) => {
        next(err);
    });
};

exports.deleteCommentById = (req,res,next) => {
    const {comment_id} = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send();
    }).catch((err) => {
        next(err);
    });
};