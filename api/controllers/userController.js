const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const crypto = require('crypto');

const userModels = require('../models/user');

const User = userModels.user;
const Address = userModels.address;
const ContactDetails = userModels.contactDetails;

//user registration function
function registerUser(req, res){
    countByRole(req.body.role, function(IndexNo){
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
                        saveUser(req, hash, IndexNo)
                            .then(result => {
                                console.log("User signed up"); 
                                    res.status(201).json({
                                    state: true,
                                    exist: false,
                                    indexNo: IndexNo
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                    state: false,
                                    Message: "Some Validation Errors"
                                });
                            });
                    }
                });
            }
        })
    })
}

//save user
function saveUser(req, hash, IndexNo){
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
        indexNo: IndexNo,
        nicNo: req.body.nicNo,
        email: req.body.email,
        password: hash, 
        fullName: req.body.fullName,
        batch: req.body.batch,
        role: req.body.role,
        school: req.body.school,
        clzes: req.body.clzes,
        stream: req.body.stream,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        gender: req.body.gender,
        address: address._id,
        contactDetails: contactDetails._id
    });
        contactDetails
            .save()
        address
            .save()

    return user.save();
}

//change password
function resetPassword(userId, newPassword){
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if(err){
            console.log(err)
            return err;
        }else {
            console.log(hash)
            User
                .update({ _id: userId },{$set: { password: hash }})
                .then(result => {
                    console.log(result)
                })

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

//check if user is exist
function checkUserIfExist(req, res, next){
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .exec()
        .then(user => {
            if(!user){
                res.status(500).json({
                    state: false
                })
            } else{
                next()
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false,
                Message: "User Not Exist"
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

//generate random hexadecimal number for verifications
function generateRandomNumber(req, res, next) {
    const len = 7;
    return crypto
      .randomBytes(Math.ceil(len / 2))
      .toString('hex')
      .slice(0, len) 
}  

function generateRandomPassword(req, res, next) {
    const len = 10;
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len)
}

function countByRole(searchRole, cb){
    User
        .find({ role: searchRole })
        .exec()
        .then(result => {
            const count = result.length+101
            if(searchRole == 'Student'){
                return cb('S'+count);
            }else if(searchRole == 'Teacher'){
                return cb('T'+count);
            }else if(searchRole == 'Card Marker'){
                return cb('C'+count);
            }else if(searchRole == 'Admin'){
                return cb('A'+count);
            }else if(searchRole == 'Paper Marker'){
                return cb('P'+count);
            }else if(searchRole == 'Super Admin'){
                return cb('SA'+count);
            }else{
                return cb();
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function getClasses(clzId, cb){
    var studentList = [];
    User    
        .find({ role: "Student" })
        .exec()
        .then(users => {
            console.log(users.length)
            for(i=0; i<users.length; i++){
                console.log(users[i].clzes)
                for(j=0; j<users[i].clzes.length; i++){
                    if(users[i].clzes[j] == clzId){
                        studentList.push(users[i]._id);
                    }
                }
            }
            console.log(studentList);
            return cb(studentList)
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = {
    registerUser: registerUser,
    findStudentById: findStudentById,
    resetPassword: resetPassword,
    addClz: addClz,
    generateRandomNumber: generateRandomNumber,
    generateRandomPassword: generateRandomPassword,
    countByRole: countByRole,
    checkUserIfExist: checkUserIfExist,
    getClasses: getClasses
};