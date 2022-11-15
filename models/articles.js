const db = require('../db/connection.js');
const { checkArticleExists } = require('../db/utils.js');

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
    
    if(!article_id.match(/^[0-9]*$/gm)){
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
            return Promise.reject({
                status: 404,
                msg: 'invalid request for article id'
            })
        }
        return result.rows[0];
    });
}

exports.fetchCommentsByArticleId = (article_id) => {
    
    if(!article_id.match(/^[0-9]*$/gm)){
        return Promise.reject({
            status: 400,
            msg: 'invalid request for article id'
        })
    }
    return checkArticleExists(article_id)
        .then(() => {
        return db.query(`
            SELECT * FROM comments
            WHERE article_id = $1;
            `,[article_id])
        })
        .then((result) => {
            return result.rows;
        })
    }
