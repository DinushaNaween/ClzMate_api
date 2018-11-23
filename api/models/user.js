const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId },
    firstLine: { type: String },
    secondLine: { type: String },
    city: { type: String },
    district: { type: String }
    },{
        timestamps: true
});

const contactDetailsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId },
    landNumber: { type: String },
    mobileNumber: { type: String },
    motherName: { type:String },
    momNumber: { type: String },
    fatherName: { type: String },
    dadNumber: { type: String },
    gardianName: { type: String },
    gardianNumber: { type: String }
    },{
        timestamps: true
});

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    indexNo: { type: String },
    nicNo: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },
    fullName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    batch: { type: String  },
    clzes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clz'
    }],
    school: { type: String },
    birthday: { type: String },
    gender: { type: String },
    address: { type: mongoose.Schema.Types.ObjectId, ref:'Address' },
    contactDetails: { type: mongoose.Schema.Types.ObjectId, ref:'ContactDetails' }
    },{
    timestamps: true
});

module.exports = {
    user: mongoose.model('User', userSchema),
    address: mongoose.model('Address', addressSchema),
    contactDetails: mongoose.model('ContactDetails', contactDetailsSchema)
};