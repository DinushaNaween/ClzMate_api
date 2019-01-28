const Mark = require('../models/mark');

function getMarksByClzId(clzId, cb){
    Mark
        .find({ clz: clzId })
}

module.exports = {
    getMarksByClzId: getMarksByClzId
}