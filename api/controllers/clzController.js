const Clz = require('../models/clz');

function findClzById(req, res, next){
    const clzId = req.body.clz;
    Clz
        .findById(clzId)
        .exec()
        .then(clz => {
            if(!clz){
                res.status(200).json({
                    state: false
                })
            } else {
                console.log('find Clz OK')
                next()
            }
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        })
}

function count(cb){
    Clz
        .find()
        .exec()
        .then(result => {
            const count = result.length+101
            console.log(count);
            return cb(count);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    findClzById: findClzById,
    count: count
}