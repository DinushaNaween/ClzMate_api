const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uploadController = require('../controllers/uploadController');
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/check-auth');
const emailController = require('../controllers/emailController');

const userModels = require('../models/user');

const User = userModels.user;
const Address = userModels.address;
const ContactDetails = userModels.contactDetails;

//get all user details
router.get('/', (req, res) =>{
    User
        .find()
        .populate('contactDetails address')
        .exec() 
        .then(result => { 
            console.log(result);
                res.status(200).json({
                    User: result
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
router.post('/register', uploadController.userImageUpload.single('image'),
            userController.registerUser);

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
                    token = jwt.sign({user: user[0]}, process.env.JWT_KEY,(err, token) => {
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
    const Id = req.params.userId;
    User
        .findById(Id)
        .populate('address contactDetails')
        .then(result => {
            if (!result){
                res.status(200).json({
                    state: false
                })
            } else {
                console.log(result)       
                Address
                    .remove({ _id: result.address._id }) 
                    .then() 
            
                ContactDetails  
                    .remove({ _id: result.contactDetails._id })
                    .then()
                User
                    .remove({ _id: req.params.userId })
                    .then()

                res.status(200).json({
                    state: true
            });
            }
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
        if (ops.propName == 'clzes'){
            userController.addClz(id, ops.value)
        }
        if (ops.propName == 'password'){
            userController.resetPassword(id, ops.value)
        } 
        else {
            updateOps[ops.propName] = ops.value;
        }
    }
    User
        .update({ _id: id }, { $set: updateOps })
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

//edit user address by Id
router.patch('/addressUpdate/:addressId', (req, res, next) => {
    const id = req.params.addressId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Address
        .update({ _id: id }, { $set: updateOps })
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

//edit user contactDetails by Id
router.patch('/contactDetailsUpdate/:contactDetailsId', (req, res, next) => {
    const id = req.params.contactDetailsId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    ContactDetails
        .update({ _id: id }, { $set: updateOps })
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

//get user details by Id
router.get('/:userId', (req, res, next) => {
    const Id = req.params.userId;
    User
        .findById(Id)
        .populate('contactDetails address')
        .exec()
        .then(result => {
            res.status(200).json({
                User: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                state: false
            });
        });
})

//get users by role
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

//check password of a loged user before edit his profile
router.post('/checkPassword/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const currentPassword = req.body.password;
    // const thispassword;
    User
        .findById(userId)
        .exec()
        .then(user => {
            savedPassword = user.password;
            bcrypt.compare(currentPassword, savedPassword, (err, result) => {
                if(result){
                    res.status(200).json({
                        state: true
                    })
                } else {
                    res.status(500).json({
                        state: false
                    })
                }
            })
        })
})

//send reset password email to user
router.get('/forgotPassword/:userId', (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId)
    User
        .findById(userId)
        .exec()
        .then(user => {
            const receiver = user.email;
            console.log(receiver)
            const verificationCode = userController.generateRandomNumber()
            emailController.sendEmail(receiver, verificationCode);
            res.status(200).json({
                state: true,
                code: verificationCode
            })
        }) 
        .catch(err => {
            console.log(err);  
            res.status(500).json({
                state: false
            })
        })
});

//reset password
router.get('/resetPassword/:userId', (req, res, next) => {
    const number = userController.generateRandomNumber()
    console.log(number)
    res.status(200).json({
        state: true
    })
})

/*special route for delete all users in database
this is use for developing perposes
Super admins only */
router.delete('/special/deleteAllUsers', (req, res, next) => {
    User
        .find()
        .populate('address contactDetails')
        .then(result => {
            if (!result){
                res.status(200).json({
                    state: false
                })
            } else {
                // console.log(result)       
                Address
                    .find()
                    .remove() 
                    .then() 
            
                ContactDetails
                    .find()  
                    .remove()
                    .then()
                User
                    .find()
                    .remove()
                    .then()

                res.status(200).json({
                    state: true
            });
            }
        })
})

//test aggregate framework
router.get('/aggregateTest/:studentId', (req, res) =>{
    console.log(req.params.studentId);
    User
        .aggregate([
            { $match: { role: "Student" } },
            { $group: {
                    _id: null, 
                    count: {
                        $sum: 2
                    }
                }
            } 
        ])
        .then(result => {
            console.log(result);
        })    
});

module.exports = router; 