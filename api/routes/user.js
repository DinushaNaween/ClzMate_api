const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const uploadController = require('../controllers/uploadController');

const userModels = require('../models/user');

const User = userModels.user;
const Address = userModels.address;
const ContactDetails = userModels.contactDetails;

// const upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()) 
    }
  })
   
  var upload = multer({ storage: storage })

router.get('/', (req, res, next ) =>{
    User
        .find()
        .exec() 
        .then(docs => { 
            console.log(docs);
            const responce1 = {
                count: docs.length,
                Users: docs.map(doc => {
                    return {
                        Message: 'User Details',
                        Id: doc._id,
                        Email: doc.email,
                        Role: doc.role,
                        Full_Name: doc.fullName,
                        Batch: doc.batch,
                        Subject: doc.subject,
                        School: doc.school,
                        Birthday: doc.birthday,
                        Stream: doc.stream,
                        request: {
                            type: 'get',
                            url: 'http://localhost:3000/user/' +doc._id
                        }
                    }
                })
            }
            Address
                .find()
                .exec()
                .then(docs => {
                    console.log(docs)
                    responce2 = {
                        count: docs.length,
                        Address: docs.map(doc => {
                            return {
                                Message: 'Address',
                                _id: doc._id,
                                Address: doc.city,
                                First_Street: doc.firstStreet,
                                Second_Street: doc.secondStreet,
                                city: doc.city,
                                District: doc.district,
                            }
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
            ContactDetails
                .find()
                .exec()
                .then(docs => {
                    console.log(docs)
                    responce3 = {
                        count: docs.length,
                        ContactDetails: docs.map(doc => {
                            return {
                                Message: 'Contact Details',
                                _id: doc._id,
                                Land_Number: doc.landNumber,
                                Mobile_Number: doc.mobileNumber,
                                Mom_Number: doc.momNumber,
                                Dad_Number: doc.dadNumber,
                                Gardian_Number: doc.gardianNumber,
                            }
                        })
                    }
                    res.status(200).json([responce1,responce2,responce3]);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/signup', uploadController.userImageUploader, (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: 'Mail Exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err       
                        });
                    }else {
                        console.log('User Created');
                        console.log('Hashing Password : '+ hash)
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            fullName: req.body.fullName,
                            batch: req.body.batch,
                            role: req.body.role,
                            school: req.body.school,
                            subject: req.body.subject,
                            birthday: req.body.birthday,
                            stream: req.body.stream,
                            classDistrict: req.body.classDistrict,
                            classInstitute: req.body.classInstitute
                        });
                        const address = new Address({
                            _id: user._id,
                            no: req.body.no,
                            firstStreet: req.body.firstStreet,
                            secondStreet: req.body.secondStreet,
                            city: req.body.city,
                            district: req.body.district
                        });
                        const contactDetails = new ContactDetails({
                            _id: user._id,
                            landNumber: req.body.landNumber,
                            mobileNumber: req.body.mobileNumber,
                            momNumber: req.body.momNumber,
                            dadNumber: req.body.dadNumber,
                            gardianNumber: req.body.gardianNumber
                        })

                        contactDetails
                            .save()
                        address
                            .save()
                        user
                            .save()

                            .then(result => {
                                console.log({ 
                                    Message1: ' User Signed up ',
                                    E_mail: req.body.email,
                                    Hashed_password: hash,
                                    Full_Name: req.body.fullName,
                                    Batch: req.body.batch,
                                    Role: req.body.role,
                                    School: req.body.school,
                                    Subject: req.body.subject,
                                    Birthday: req.body.birthday,
                                    Stream: req.body.stream,
                                    Message2: ' Address ',
                                    No: req.body.no,
                                    First_Street: req.body.firstStreet,
                                    Second_Street: req.body.secondStreet,
                                    City: req.body.city,
                                    District: req.body.district,
                                    Meaasge3: ' Contact Details ',
                                    Land_Number: req.body.landNumber,
                                    Mobile_Number: req.body.mobileNumber,
                                    Mom_Number: req.body.momNumber,
                                    Dad_Number: req.body.dadNumber,
                                    Gardian_Number: req.body.gardianNumber
                                });
                                res.status(201).json({
                                    Message1: ' User Signed up ',
                                    E_mail: req.body.email,
                                    Hashed_password: hash,
                                    Full_Name: req.body.fullName,
                                    Batch: req.body.batch,
                                    Role: req.body.role,
                                    School: req.body.school,
                                    Subject: req.body.subject,
                                    Birthday: req.body.birthday,
                                    Stream: req.body.stream,
                                    Message2: ' Address ',
                                    No: req.body.no,
                                    First_Street: req.body.firstStreet,
                                    Second_Street: req.body.secondStreet,
                                    City: req.body.city,
                                    District: req.body.district,
                                    Meaasge3: ' Contact Details ',
                                    Land_Number: req.body.landNumber,
                                    Mobile_Number: req.body.mobileNumber,
                                    Mom_Number: req.body.momNumber,
                                    Dad_Number: req.body.dadNumber,
                                    Gardian_Number: req.body.gardianNumber
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
});

router.post('/login', (req, res) =>{
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Authantication failed. E-mail not exist.'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (result){
                    token = jwt.sign({user: user}, 'secretkey',(err, token) => {
                        if(err){
                            res.json({ error: err })
                        } else {
                            console.log('Token is:- '+token);
                            return res.status(200).json({
                                currentpassword: req.body.password,
                                databasePassword: user[0].password,
                                Message: 'User Logged in',
                                Email: req.body.email,
                                JWT_Token: token
                            })
                        }
                        console.log('token genetas : '+ this.token);
                    });
                }
                else {
                    return res.status(401).json({
                        message: 'Authantication Failed. Password is incorrect.'
                    })
                }
            });
        })
        .catch(err => {
            console.log(err);
            console.log('catch block')
            res.status(500).json({
                error: err
            }); 
        });
});

router.delete('/:userId', (req, res ) => {
    User
        .remove({ _id: req.params.userId })
        .then(result => {
            res.status(200).json({
                Message: 'User Deleted',
                Deleted_User: req.params.userId
            });
            console.log(result);
            
                Address
                    .remove({ _id: req.params.userId })
                    .then()
            
                ContactDetails  
                    .remove({ _id: req.params.userId })
                    .then()
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/image', upload.single('image'), (req, res, next) => {

})

module.exports = router;