const { checkArticleExists } = require('../db/utils.js');
const db = require('../db/connection.js');

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

exports.addCommentsToArticleId = (article_id,newComment) => {
 
    if(!article_id.match(/^[0-9]*$/gm)){
        return Promise.reject({
            status: 400,
            msg: 'invalid request for article id'
        })
    }
    return checkArticleExists(article_id)
        .then(() => {
            return db.query(`
                INSERT INTO comments
                (body,article_id,author)
                VALUES
                ($1,$2,$3)
                RETURNING *;
                `,[newComment.body,article_id,newComment.username])
        })
        .then((result) => {
            return result.rows[0];
        })
}