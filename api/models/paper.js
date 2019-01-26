const mongoose = require('mongoose');

const paperSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    paperNo: { type: String },
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz' },
    date: Date
    },{
        timestamps: true
});

module.exports = mongoose.model('Paper', paperSchema);