const db = require('../db/connection.js');

exports.fetchArticles = () => {
    return db.query(
        `
        SELECT articles.*, COUNT(comments.comment_id) AS comments_count FROM comments
        RIGHT JOIN articles ON comments.article_id = articles.article_id
        GROUP BY articles.article_id;
        `
    ).then((result) => {
        return result.rows;
    });
}