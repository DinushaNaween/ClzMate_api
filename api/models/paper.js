const mongoose = require('mongoose');

const paperSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz' }
    },{
        timestamps: true
});

module.exports = mongoose.model('Paper', paperSchema);