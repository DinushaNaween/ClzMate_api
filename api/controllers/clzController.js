const Clz = require('../models/clz');

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
                state: false
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
            return cb('Clz'+count);
        })
        .catch(err => {
            console.log(err);
        })
}

//convert clzNo to clzId
function clzNoToClzId(clzNo){
    Clz
        .find({ clzNo: clzNo })
        .exec()
        .then(clz => {
            const clzId = clz._id;
            return clzId;
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
}

module.exports = {
    findClzById: findClzById,
    count: count,
    findClzIfExist: findClzIfExist,
    clzNoToClzId: clzNoToClzId
}