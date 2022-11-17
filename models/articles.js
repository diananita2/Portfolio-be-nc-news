const db = require('../db/connection.js');

exports.fetchArticles = (topic,sort_by = 'created_at',order = 'desc') => {
   
    const validOrder = ['asc','desc'];
    const validSortByColumns = ['title','topic','author','body','created_at','votes']
    if(!validOrder.includes(order) || !validSortByColumns.includes(sort_by)){
        return Promise.reject({status:400,msg:'invalid query'})
    }
    let queryStr = `SELECT * FROM articles`;
    let queryValues = [];
    if(topic){
        queryStr += ` WHERE topic = $1`;
        queryValues.push(topic);
    }

    queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;
    queryStr += ';';
    
    return db.query(queryStr,queryValues).then((result) => {
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

exports.updateArticleById = (article_id,articleUpdates) => {
    
    if(!article_id.match(/^[0-9]*$/gm)){
        return Promise.reject({
            status: 400,
            msg: 'invalid request for article id'
        })
    }
    
    return db.query(
        `
        UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING*;
        `,[article_id,articleUpdates.inc_votes]
    ).then((result) => {
        
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'article not found'
            })
        }
        return result.rows[0];
    });
}


