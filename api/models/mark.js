const mongoose = require('mongoose');

const markSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mark: { type: Number },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paper: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper' },
    paperMarker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{
        timestamps: true
});

module.exports = mongoose.model('Mark', markSchema);