const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    attendance: {
        type: [{
            type: Boolean
        }],
        validate: [ arrayLimit, '{PATH} exceeds the limit of 10' ]
    },
    clz: { type: mongoose.Schema.Types.ObjectId, ref: 'Clz' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cardMarker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{
        timestamps: true
});

function arrayLimit(val){
    return val.length <= 10;
}

module.exports = mongoose.model('Attendance', attendanceSchema);