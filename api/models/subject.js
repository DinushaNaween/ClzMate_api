const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    level: { type: String },  // A/L or O/L
    stream: { type: String }
    },{
        timestamps: true
});

module.exports = mongoose.model('Mark', subjectSchema);