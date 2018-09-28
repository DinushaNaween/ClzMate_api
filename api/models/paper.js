const mongoose = require('mongoose');

const paperSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz', required: true },
    quantity: { type: Number, default: 1 }
    },{
        timestamps: true
});

module.exports = mongoose.model('Paper', paperSchema);