const { fetchUsers } = require("../models/users");

exports.getUsers = (req,res,next) => {
    fetchUsers().then((result) => {
       res.status(200).send({users:result});
    }).catch((err) => {
        next(err);
    });
};