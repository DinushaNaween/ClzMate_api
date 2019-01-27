const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Mark = require('../models/mark');
const Paper = require('../models/paper');

const checkAuth = require('../middlewares/check-auth');

//get all marks
router.get('/', (req, res, next) => {
    Mark
        .find()
        .populate('student paper paperMarker', `indexNo paperNo clz`)
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

//get single mark details by Id
router.get('/:markId', (req, res, next) => {
    const searchId = req.params.markId;
    Mark
        .findById(searchId)
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
        });
});

//delete mark by Id
router.delete('/:markId', (req, res, next) => {
    const deleteId = req.params.markId;
    Mark
        .findById(deleteId)
        .exec()
        .then(mark => {
            if(!mark){
                res.status(200).json({
                    state: false
                })
            } else{
                Mark
                    .remove({ _id: deleteId })
                    .then()

                    res.status(200).json({
                        state: true
                    });
            }
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        })
});

//edit mark by Id
router.patch('/:markId', (req, res, next) => {
    const patchId = req.params.markId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Mark
        .update({ _id: patchId }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                state: true
            })
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        })
});

router.get('/getmarksOfStudent/:studentId/:clzId', (req, res, next) => {
    res.status(200).json({
        state: true
    })
})

module.exports = router;