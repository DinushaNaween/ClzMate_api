const Paper = require('../models/paper');

function count(cb){
    Paper
        .find()
        .exec()
        .then(result => {
            const count = result.length+101
            console.log(count);
            return cb('Paper'+count);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    count: count
}


