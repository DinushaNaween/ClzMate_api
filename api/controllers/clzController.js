const Clz = require('../models/clz');

//find clz if exist
function findClzById(req, res, next){
    const clzId = req.body.clz;
    Clz
        .find({ clzNo: clzId })
        .exec()
        .then(clz => {
            if(!clz){
                res.status(200).json({
                    state: false
                })
            } else {
                req.body.clz = clz[0]._id;
                console.log(req.body.clz)
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
 
//find clz if exist by passing clzId via params
function findClzIfExist(req, res, next){
    const clzId = req.params.clzId;
    Clz
        .find({ _id: clzId })
        .exec()
        .then(clz => {
            if(!clz){
                res.status(500).json({
                    state: false
                })
            } else{
                console.log("clz found");
                next()
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false,
                Message: "Class Id isn't exist"
            })
        })
}

//count no of classes
function count(cb){
    Clz
        .find()
        .exec()
        .then(result => {
            const count = result.length+101
            console.log(count);
            return cb('Class'+count);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    findClzById: findClzById,
    count: count,
    findClzIfExist: findClzIfExist
}