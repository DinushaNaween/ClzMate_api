const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    merchant_id: { type: String },
    order_id: { type: String },
    payment_id: { type: String },
    payhere_amount: { type: Number },
    payhere_currency: { type: String },
    status_code: { type: Number },
    status: { type: String },
    md5sig: { type: String },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //StudentId
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz' },  //clzId
    date: Date
    },{
        timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);