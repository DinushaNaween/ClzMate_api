const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uploadController = require('../controllers/uploadController');

const userModels = require('../models/user');

const User = userModels.user;
const Address = userModels.address;
const ContactDetails = userModels.contactDetails;

router.get('/', (req, res) =>{
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
                            url: 'https://polar-meadow-28819.herokuapp.com/user/' +doc._id
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

router.post('/register', uploadController.userImageUpload.single('image'), (req, res, next) => {
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
                                    user,
                                    address,
                                    contactDetails
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

router.patch('/userUpdate/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps })
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