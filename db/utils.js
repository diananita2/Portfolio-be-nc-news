const db = require('./connection');

exports.checkArticleExists = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1;
        `,[article_id])
    .then(result => {
        if(result.rows.length === 0){
        return Promise.reject({status:404,msg:'article not found'})
        }
    })
}

async function selectCommentsOfArticle(article_id){
    return db.query(`SELECT * FROM comments WHERE article_id = $1;`,[article_id])
}
async function addCommentsCountColumn(){
    return db.query(`ALTER TABLE articles ADD comments_count INT DEFAULT 0;`)
}

exports.addCommentsCountToArticle = async (article_id) =>{
    const alterResult = await addCommentsCountColumn();
    const comments = await selectCommentsOfArticle(article_id);
    const comments_count = comments.rows.length;
    return db.query(`UPDATE articles SET comments_count = ${comments_count} WHERE article_id = $1 RETURNING*;`
        ,[article_id])
    .then((updatedArticle) => {
        return updatedArticle.rows[0]
    })
}

