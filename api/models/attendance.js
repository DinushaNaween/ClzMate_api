const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    year: { type: Number },
    month: { type: Number },
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz' },
    student: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    cardMarker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{
        timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema); 