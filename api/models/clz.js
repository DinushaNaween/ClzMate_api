const mongoose = require('mongoose');

const clzSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clzNo: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subjectName: { type: String },
    hallNo: { type: Number },
    grade: { type: String },
    day: { type: String },
    batch: { type: String },
    
    stream: { type: String },
    time: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cardMarker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{
        timestamps: true
});

module.exports = mongoose.model('Clz', clzSchema);