const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uploadController = require('../controllers/uploadController');
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/check-auth');
const checkToken = require('../middlewares/check-token');
const emailController = require('../controllers/emailController');

const userModels = require('../models/user');
const Clz = require('../models/clz');

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
router.post('/register', checkToken.checkToken, checkAuth.checkIfAdmin, uploadController.userImageUpload.single('image'),
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
                    token = jwt.sign({user: user[0]}, process.env.JWT_KEY, {expiresIn: "1h"}, (err, token) => {
                        if(err){
                            res.json({ error: err })
                        } else {
                            // console.log('Token is:- '+token);
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
                        state: false,
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
            res.status(200).json({
                state: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
      });
}); 

//edit user address by Id
router.patch('/addressUpdate/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .exec()
        .then(user => {
            const addressId = user[0].address;
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Address
                .update({ _id: addressId }, { $set: updateOps })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        state: true
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        state: false
                    });
            });
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
}); 

//edit user contactDetails by Id
router.patch('/contactDetailsUpdate/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .exec()
        .then(user => {
            const contactDetailsId = user[0].contactDetails
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            ContactDetails
                .update({ _id: contactDetailsId }, { $set: updateOps })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        state: true
                    });
                })
                .catch(err => {
                    console.log(err);
                        res.status(500).json({
                        state: false
                    });
            });
        })
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
router.get('/forgotPassword/:userEmail', (req, res, next) => {
    const userEmail = req.body.email;
    console.log(userEmail);
    User
        .find({ email: userEmail })
        .exec()
        .then(user => {
            if(user){
                const verificationCode = userController.generateRandomNumber()
                console.log(verificationCode);
                emailController.sendEmail(userEmail, verificationCode);
                res.status(200).json({
                    state: true, 
                    code: verificationCode
                })
            } else {
                res.status(500).json({
                    state: false
                })
            }
        }) 
        .catch(err => {
            console.log(err);    
            res.status(500).json({
                state: false
            })
        })
});

// special route for delete all users in database
// this is use for developing perposes
// developers only 

 
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


//get clzes by cardmarker Id
router.get('/getClzByCardMarkerId/:cardMarkerId', (req, res, next) => {
    const userId = req.params.cardMarkerId;
    console.log(userId)
    User
        .find({ _id: userId })
        .then(user => {
            if(user[0].role == 'cardmarker'){
                res.status(200).json({
                    clzes: user[0].clzes
                })
            } else{
                res.status(500).json({
                    state: false
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

//get students of any clz
router.get('/getStudentByClz/:clzId', (req, res, next) => {
    const clzId = req.params.clzId;
    User
        .find({ clzes: clzId })
        .then(list => {
            console.log(list);
            res.status(200).json({
                list
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

router.get('/test/:role', (req, res) =>{
    // .then(result => {
        userController.countByRole(req.params.role, count)
        console.log(count);
    // })
    res.status(200).json({
        Message: true
    })    
});

module.exports = router; 