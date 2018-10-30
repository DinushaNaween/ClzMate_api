const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userModels = require('../models/user');

const User = userModels.user;
const Address = userModels.address;
const ContactDetails = userModels.contactDetails;

//user registration function
function registerUser(req, res){
    User.find({ email: req.body.email })
        .exec()
        .then(user => { 
            if(user.length >= 1){
                console.log('user exist');
                return res.status(409).json({
                    state: false,
                    exist: true
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({     
                        });
                    }else {
                        saveUser(req, hash)
                            .then(result => {
                                console.log("User signed up"); 
                                res.status(201).json({
                                    state: true,
                                    exist: false
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    state: false,
                                    Message: 'Some Validation Errors'
                                });
                            });
                    }
                });
            }
        })
}

//save user
function saveUser(req, hash){
    const address = new Address({
        _id: new mongoose.Types.ObjectId(),
        firstLine: req.body.firstLine,
        secondLine: req.body.secondLine,
        city: req.body.city,
        district: req.body.district
    });
    const contactDetails = new ContactDetails({
        _id: new mongoose.Types.ObjectId(),
        landNumber: req.body.landNumber,
        mobileNumber: req.body.mobileNumber,
        motherName: req.body.motherName,
        momNumber: req.body.momNumber,
        fatherName: req.body.fatherName, 
        dadNumber: req.body.dadNumber,
        gardianName: req.body.gardianName,
        gardianNumber: req.body.gardianNumber
    })
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash, 
        fullName: req.body.fullName,
        batch: req.body.batch,
        role: req.body.role,
        school: req.body.school,
        subjects: req.body.subjects,
        stream: req.body.stream,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        address: address._id,
        contactDetails: contactDetails._id
    });
        contactDetails
            .save()
        address
            .save()

    return user.save();
}

//hash password
function hashPassword(req, res, next){
    console.log('hashPassword')
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            console.log(err)
            return err;
        }else {
            console.log(hash)
            return hash;
        }
    });
}

//find student by id
function findStudentById(req, res, next){
    const studentId = req.body.student;
    User
        .findById(studentId)
        .exec()
        .then(user => {
            if(!user){
                res.status(200).json({
                    state: false
                })
            } else {
                next()
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
}

//add clz to existing student
function addClz(user, value){
    User
        .findById(user)
        .exec()
        .then(User => {
            User.clzes
                .push(value)
            User
                .save()
                .then()
        })
}

module.exports = {
    registerUser: registerUser,
    findStudentById: findStudentById,
    hashPassword: hashPassword,
    addClz: addClz
};