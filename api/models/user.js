const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstLine: { type: String },
    secondLine: { type: String },
    city: { type: String, required: true },
    district: { type: String }
})

const contactDetailsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    landNumber: { type: String },
    mobileNumber: { type: String },
    motherName: { type:String },
    momNumber: { type: String },
    fatherName: { type: String },
    dadNumber: { type: String },
    gardianName: { type: String },
    gardianNumber: { type: String }
})

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique:true,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true,
        lowercase: true 
    },
    
    fullName: {type: String , required: true},
    firstName: { type: String },
    lastName: { type: String },
    batch: { type: Number, required: true },
    subjects: [{
        type: String
    }],
    school: { type: String, required: true },
    birthday: { type: String },
    address: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    contactDetails: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    stream: { type: String }
});

module.exports = {
    user: mongoose.model('User', userSchema),
    address: mongoose.model('Address', addressSchema),
    contactDetails: mongoose.model('ContactDetails', contactDetailsSchema)
}; 