const mongoose = require('mongoose');

const clzSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subjectName: { type: String },
    hallNo: { type: Number },
    grade: { type: String },
    day: { type: String },
    batch: { type: String },
    time: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cardMarker: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    },{
        timestamps: true
});

module.exports = mongoose.model('Clz', clzSchema);