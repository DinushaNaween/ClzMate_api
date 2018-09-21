const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleId: mongoose.Schema.Types.ObjectId,
    roleName: { type: String },
    rolePermission: [{
        type: String
    }]
});

module.exports = mongoose.model('Role', roleSchema);