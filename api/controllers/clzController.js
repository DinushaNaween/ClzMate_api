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

module.exports = {
    findClzById: findClzById
}