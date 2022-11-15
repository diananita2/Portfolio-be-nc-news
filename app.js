const express = require('express');
const { getArticles, getArticleById} = require('./controllers/articles');
const { getTopics} = require('./controllers/topics');

const app = express();

app.use(express.json());

app.get('/api/topics',getTopics);

app.get('/api/articles',getArticles);

app.get('/api/articles/:article_id',getArticleById);

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