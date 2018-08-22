const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const uploadController = require("../controllers/uploadController");

const User = require('../models/user');

router.get('/', (req, res, next) =>{
    User.find()
        .select('email role _id')
        .exec()
        .then(docs => {
            console.log(docs);
            const responce = {
                count: docs.length,
                Users: docs.map(doc => {
                    return {
                        email: doc.email,
                        role: doc.role,
                        _id: doc._id,
                        request: {
                            type: 'get',
                            url: 'http://localhost:3000/user/' +doc._id
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
});

router.post('/signup', uploadController.userImageUploader, (req, res, next) => {
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
                            password: hash
                        });
                        user
                            .save()
                            .then(result =>{
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Signed up',
                                    email: req.body.email,
                                    hashed_password: hash
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
                if (err){
                    return res.status(401).json({
                        message: 'Authantication Failed'
                    });
                }
                if (result){
                    const token = jwt.sign({user: user}, 'secretkey',(err, token) => {
                        if(err){
                            res.json({ error: err })
                        } else {
                            console.log(token);
                            return res.status(200).json({
                                message: 'User Logged in',
                                token: this.token
                            })
                        }
                        console.log('token genetas : '+ this.token);
                    });
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

router.delete('/:userid', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;