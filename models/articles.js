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