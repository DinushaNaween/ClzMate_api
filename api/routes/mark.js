const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Mark = require('../models/mark');
const Paper = require('../models/paper');

//get all marks
router.get('/', (req, res, next) => {
    Mark
        .find()
        .populate('student paper paperMarker')
        .exec()
        .then(mark => {
            res.status(200).json({
                mark
            })
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        })
});

//add mark (with student, paper, paperMarker)
router.post('/addMark', (req, res, next) => {
    const paperId = req.body.paper;
    Paper
        .findById(paperId)
        .exec()
        .then(result => {
            if(!result){
                res.status(200).json({
                    state: false,
                    Message: 'paper not exist'
                })
            } else {
                const mark = new Mark({
                    _id: mongoose.Types.ObjectId(),
                    mark: req.body.mark,
                    student: req.body.student,
                    paper: paperId,
                    paperMarker: req.body.paperMarker
                });
                mark
                    .save()
                    .then(result => {
                        res.status(200).json({
                            state: true
                        });
                    })
                    .catch(err => {
                        res.status(200).json({
                            state: false
                        });
                    });
            }
        });
});

module.exports = router;