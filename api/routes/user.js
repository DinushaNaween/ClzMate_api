const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uploadController = require('../controllers/uploadController');
const userController = require('../controllers/userController');

const userModels = require('../models/user');

const User = userModels.user;
const Address = userModels.address;
const ContactDetails = userModels.contactDetails;

//get all user details
router.get('/', (req, res) =>{
    console.log('get route')
    User
        .find()
        .populate('contactDetails address')
        .exec() 
        .then(docs => { 
            console.log(docs);
                res.status(200).json({
                Users: docs.map(doc => {
                    return{
                        UserId: doc._id,
                        First_Name: doc.firstName,
                        Last_Name: doc.lastName,
                        Email: doc.email,
                        Birthday: doc.birthday,
                        Batch: doc.batch,
                        Role: doc.role,
                        Full_Name: doc.fullName,
                        Subjects: doc.subjects,
                        School: doc.school,
                        AddressId: doc.address._id,
                        First_Line: doc.address.firstLine,
                        Second_Line: doc.address.secondLine,
                        City: doc.address.city,
                        District: doc.address.district,
                        ContactDetailsId: doc.contactDetails._id,
                        Land_Number: doc.contactDetails.landNumber,
                        Mobile_Number: doc.contactDetails.mobileNumber,
                        Mother_Name: doc.contactDetails.motherName,
                        Mother_Number: doc.contactDetails.momNumber,
                        Father_Name: doc.contactDetails.fatherName,
                        Father_Number: doc.contactDetails.dadNumber,
                        Gardian_Name: doc.contactDetails.gardianName,
                        Gardian_Number: doc.contactDetails.gardianNumber
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err 
            });
        });
});

//register users
router.post('/register', uploadController.userImageUpload.single('image'), userController.registerUser);

//login user
router.post('/login', (req, res) =>{
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(200).json({
                    //message: 'Authantication failed. E-mail not exist.',
                    JWT_Token: null
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (result){
                    token = jwt.sign({user: user[0]}, 'secretkey',(err, token) => {
                        if(err){
                            res.json({ error: err })
                        } else {
                            console.log('Token is:- '+token);
                            return res.status(200).json({
                                state: true,
                                JWT_Token: token
                            })
                        }
                        console.log('token genetas : '+ this.token);
                    });
                }
                else {
                    return res.status(200).json({
                        //message: 'Authantication Failed. Password is incorrect.',
                        JWT_Token: null
                    })
                }
            });
        })
        .catch(err => {
            console.log(err);
                res.status(500).json({
                error: err
            }); 
        });
});

//delete user by Id
router.delete('/:userId', (req, res ) => {
    console.log(req.params.userId);
    User
        .remove({ _id: req.params.userId })
        .then(result => {
            res.status(200).json({
                state: true
                // Message: 'User Deleted',
                // Deleted_User: req.params.userId
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

//edit user by Id
router.patch('/userUpdate/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    User
        .findById(id)
        .populate('address','city')
        console.log(id)
        console.log(User[0].email)
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(address)
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/addressUpdate/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Address.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
}); 

router.patch('/contactDetailsUpdate/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    ContactDetails.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.get('/:userId', (req, res, next) => {
    const Id = req.params.userId;
    User
        .findById(Id)
        .exec()
        .then(user => {
            console.log(user);
            const responce1 = {
                user
            }
            Address
                .findById(Id)
                .exec()
                .then(address => {
                    console.log(address);
                    responce2 = {
                        address
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                })
                ContactDetails
                    .findById(Id)
                    .exec()
                    .then(contactDetails => {
                        console.log(contactDetails);
                        responce3 = {
                            contactDetails
                        }
                        res.status(200).json([responce1,responce2,responce3]);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.post('/register1', (req, res) =>{
    var email =req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);

    if(email && password){
        res.status(200).json({
            msg:true
        });
    } else {
        res.status(200).json({
            msg:false
        })
    }
  
});

router.get('/findByRole/:role', (req, res, next) => {
    const role = req.params.role;
    User
        .find({ role: role })
        .exec()
        .then(user => {
            console.log(user);
            const count = user.length;
            const responce = {
                count: count,
                Users: user.map(doc => {
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
                            url: 'https://polar-meadow-28819.herokuapp.com/user/' +doc._id
                        }
                    }
                })
            }
            res.status(200).json(responce);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;