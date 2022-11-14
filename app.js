const express = require('express');
const { getTopics } = require('./controllers/topics');

const app = express();

app.use(express.json());

app.get('/api/topics',getTopics);

app.use((err,req,res,next) => {
    console.log('here')
    if(err.status && err.msg) {
        console.log(err.msg)
        res.status(err.status).send({msg:err.msg})
    }
})
module.exports = app;