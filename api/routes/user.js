const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');

const uploadController = require('../controllers/uploadController');
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/check-auth');
const checkToken = require('../middlewares/check-token');
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
router.post('/register', userController.registerUser);

//upload user image for profile
router.post('/uploadUserImage/:userId', uploadController.userImageUpload.single('image'), (req, res, next) => {
    console.log("uploadUserImage")
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .exec()
        .then(user => {
            console.log("user found")
            cloudinary.uploader.upload(req.file.path, function(result) {
                imageSecureURL = result.secure_url;
                console.log(imageSecureURL)
                user[0].imageURL = imageSecureURL;
                user[0]
                    .save()
                    .then(result => {
                        res.status(200).json({
                            state: true
                        }) 
                    })
            });
        })
        .catch(err => {
            res.status(401).json({
                state: false
            })
        })
})

//login user
router.post('/login', (req, res) =>{
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(200).json({
                    state: false,
                    JWT_Token: null
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (result){
                    token = jwt.sign({user: user[0]}, process.env.JWT_KEY, {expiresIn: "10h"}, (err, token) => {
                        if(err){
                            res.json({ error: err })
                        } else {
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
router.delete('/:userId', checkToken.checkToken, checkAuth.checkIfAdmin, userController.checkUserIfExist, (req, res ) => {
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

//edit user address by Id
router.patch('/addressUpdate/:userId', checkToken.checkToken, checkAuth.checkIfAdmin, userController.checkUserIfExist, (req, res, next) => {
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
router.patch('/contactDetailsUpdate/:userId', checkToken.checkToken, checkAuth.checkIfAdmin, userController.checkUserIfExist, (req, res, next) => {
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
router.get('/:userId', userController.checkUserIfExist, (req, res, next) => {
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
router.get('/forgotPassword/:email', (req, res, next) => {
    if(!req.params.email){
        res.status(401).json({
            state: false
        })
    } else {  
        const userEmail = req.params.email;
        console.log(userEmail);
        User 
            .find({ email: userEmail })
            .exec()
            .then(user => {
                if(user){
                    console.log(user[0]._id);
                    const verificationCode = userController.generateRandomNumber()
                    console.log(verificationCode);
                    emailController.sendVerificationCode(userEmail, verificationCode);
                    // emailController.sendEmail(userEmail)
                    res.status(200).json({
                        state: true, 
                        userId: user[0]._id,
                        code: verificationCode
                    })
                } else {  
                    res.status(500).json({ 
                        state: false,
                        Message: "Not Registered User"
                    })
                }
            }) 
            .catch(err => {
                console.log(err);    
                res.status(500).json({
                    state: false
                })
            })
    }
});

//after verify the email this can save new password for password foggoten person
router.get('/newPassword/:email', (req, res, next) => {
    userEmail = req.params.email;
    User
        .find({ email: userEmail })
        .exec()
        .then(user => {  
            if(user){
                console.log(user[0]._id)
                const newPassword = userController.generateRandomPassword()
                console.log(newPassword);
                userController.resetPassword(user[0]._id, newPassword)
                emailController.sendNewPassword(userEmail, newPassword);
                    res.status(200).json({
                        state: true,
                        password: newPassword
                    })
            }
        })
        .catch(err => {
            res.status(401).json({
                error: err,
                state: false
            })
        })
})

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
            if(user[0].role == 'Card Marker'){
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
    console.log(clzId+'this clz')
    User
        .find({
            $and: [ { role: "Student" }, { clzes: clzId } ]
        })
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

router.get('/getStudentsOfClz/:clzId', (req, res, next) => {
    const clzId = req.params.clzId;
    userController.getClasses(clzId, function(list){
        // console.log(list);
        const length = list.length;
        for(i=0; i<length; i++){
            
        }
    })
})

//get classes of any student
router.get('/getClasses/:studentId', (req, res) =>{
    const studentId = req.params.studentId;
    User   
        .findById(studentId) 
        .populate('clzes', `subjectName`)
        .exec()
        .then(student => {
            res.status(200).json({
                clzes: student.clzes
            })
        })
        .catch(err => { 
            res.status(500).json({
                state: false
            })     
        })
});


//edit user details
router.patch('/userUpdate/:userId', (req, res, next) => {
    const x=req.body;
    const indexNo = x.indexNo;
    const nicNo = x.nicNo;
    const email = x.email;
    const role = x.role;
    console.log(req.body)
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .populate('address contactDetails')
        .exec()
        .then(user => {
            console.log(user[0]);
            if(!user){
                res.status(500).json({
                    state: false
                })
            } else{
                user[0].
                res.status(200).json({
                    state: true
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

module.exports = router; 