const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    no: { type: String },
    firstStreet: { type: String },
    secondStreet: { type: String },
    city: { type:String, required }
})

const contactDetailsSchema = mongoose.Schema({
    landNumber: { type: number },
    mobileNumber: { type: number },
    momNumber: { type: number },
    dadNumber: { type: number },
    gardianNumber: { type: number }
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
    role: { type: String, required: true },
    
    fullName: { type: String, required: true },
    batch: { type: Number, required: true },
    subject: [{ 
        type: String 
    }],
    school: { type: String, required: true },
    birthday: { type: Date },
    address: { type: addressSchema },
    contactDetails: { type: contactDetailsSchema }
});


module.exports = mongoose.model('User', userSchema);