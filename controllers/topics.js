const { fetchTopics } = require("../models/topics");

exports.getTopics = (req,res,next) => {

    fetchTopics().then((result) => {
       res.status(200).send({topics:result});
    }).catch((err) => {
        next(err);
    });
};

