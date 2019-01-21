const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz' },
    date: Date
    },{
        timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);