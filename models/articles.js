const db = require('../db/connection.js');

exports.fetchArticles = () => {
    
    return db.query(
        `
        SELECT * FROM articles;
        `
    ).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'articles not found',
            });
        }
        return result.rows;
    });
}