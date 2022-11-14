const express = require('express');
const { getTopics, getArticles } = require('./controllers/topics');

const app = express();

app.use(express.json());

app.get('/api/topics',getTopics);

app.get('/api/articles',getArticles);

app.use((err,req,res,next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg:err.msg})
    }
})
module.exports = app;