const db = require('../db/connection.js');

exports.fetchTopics = () => {
    
    return db.query(
        `
        SELECT * FROM topics;
        `
    ).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'topics not found',
            });
        }
        return result.rows;
    });
}