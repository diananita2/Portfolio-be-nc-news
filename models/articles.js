const db = require('../db/connection.js');

exports.fetchArticles = () => {
    
    return db.query(
        `
        SELECT * FROM articles;
        `
    ).then((result) => {
        return result.rows;
    });
}

exports.fetchArticleById = (article_id) => {
    if(typeof(article_id) != Number){
        return Promise.reject({
            status: 400,
            msg: 'invalid request for article id'
        })
    }
    return db.query(
        `
        SELECT * FROM articles
        WHERE article_id = $1;
        `,[article_id]
    ).then((result) => {
        if(result.rows.length === 0){
            console.log('promise reject')
            return Promise.reject({
                status: 400,
                msg: 'invalid request for article id'
            })
        }
        return result.rows[0];
    });
}