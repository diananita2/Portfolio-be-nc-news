const express = require('express');
const { getArticles, getArticleById, patchArticleById} = require('./controllers/articles');
const { postCommentsToArticleId, getCommentsByArticleId, deleteCommentById } = require('./controllers/comments');
const { getEndpoints } = require('./controllers/endpoints');
const { getTopics} = require('./controllers/topics');
const { getUsers } = require('./controllers/users');

const app = express();

app.use(express.json());

app.get('/api/topics',getTopics);

app.get('/api/articles',getArticles);

app.get('/api/articles/:article_id',getArticleById);

app.get('/api/articles/:article_id/comments',getCommentsByArticleId);

app.post('/api/articles/:article_id/comments',postCommentsToArticleId);

app.patch('/api/articles/:article_id',patchArticleById);

app.get('/api/users',getUsers);

app.get('/api',getEndpoints);

app.delete('/api/comments/:comment_id',deleteCommentById);

app.use((err,req,res,next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg:err.msg})
    }
    else{
        next(err)
    }
})
app.use((err,req,res,next) => {
    res.status(500).send({msg:'server error!'})
})
module.exports = app;