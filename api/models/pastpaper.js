const mongoose = require('mongoose');

const pastpaperSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Pastpaper', pastpaperSchema);