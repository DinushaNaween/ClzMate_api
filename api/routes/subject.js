const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Subject = require('../models/subject');

router.get('/', (req, res, next) => {
    Subject
        .find()
        .exec()
        .then(subjects => {
            res.status(200).json({
                subjects: Subject
            });
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

router.post('/addSubject', (req, res, next) => {
    const subject = new Subject({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        level: req.body.level,
        stream: req.body.stream
    });
    subject
        .save()
        .then(result => {
            res.status(200).json({
                state: true
            })
        })
});

module.exports = router;