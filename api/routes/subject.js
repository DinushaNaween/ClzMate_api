const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Subject = require('../models/subject');

//get all details of all subjects
router.get('/', (req, res, next) => {
    Subject
        .find()
        .exec()
        .then(subjects => {
            res.status(200).json({
                subjects: subjects
            });
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

//add new subject
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

//get one subject details by ID
router.get('/:subjectId', (req, res, next) => {
    const subjectId = req.params.subjectId;
    Subject
        .find({ _id: subjectId })
        .exec()
        .then(subject => {
            res.status(200).json({
                Subject: subject
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

module.exports = router;