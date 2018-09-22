const mongoose = require('mongoose');

const clzSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    hallNo: { type: Number, required: true }
});

module.exports = mongoose.model('Clz', clzSchema);