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

function getPapersForClz(clzId, cb){
    Paper
        .find({ clz: clzId })
        .exec()
        .then(papers => {
            var selectedPapers = [];
            var length = papers.length;
            for(i=0; i<=length; i++){
                selectedPapers.push(papers._id);
            }
            return cb(selectedPapers);
        })
        .catch(err => {
            resizeBy.status(500).json({
                state: false
            })
        })
}

module.exports = {
    count: count,
    getPapersForClz: getPapersForClz
}


