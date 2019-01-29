const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Paper = require('../models/paper');
const Clz = require('../models/clz');
const User = require('../models/user');

const checkAuth = require('../middlewares/check-auth');
const paperController = require('../controllers/paperController');

//get all papers details
router.get('/', (req, res, next) => {
    Paper
        .find() 
        .populate('clz paperMarker')
        .exec()
        .then(result => {
            res.status(200).json({
                Papers: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//create a paper
router.post('/', (req, res, next) => {
    paperController.count(function(count){
        const clzId = req.body.clzId;
        Clz
            .find({ _id: clzId })
            .then(clz => {
                if (!clz) {
                    return res.status(404).json({
                        state: false
                    });
                }
                const paper = new Paper({
                    _id: new mongoose.Types.ObjectId(),
                    paperNo: count,
                    clz: req.body.clzId,
                    date: req.body.date,
                    paperMarker: req.body.paperMarker
                });
                return paper
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            state: true
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    state: false
                });
            })
    })
});

//get paper by Id
router.get('/:paperId', (req, res, next) => {
    const searchId = req.params.paperId;
    Paper
        .findById(searchId)
        .populate('clz')
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    state: false
                });
            } else {
                res.status(200).json({
                    result
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

//delete paper by Id
router.delete('/:paperId', (req, res, next) => {
    const deleteId = req.params.paperId;
    Paper
        .findById(deleteId)
        .exec()
        .then(result => {
            if (!result){
                res.status(200).json({
                    state: false
                })
            } else {
                Paper
                    .remove({ _id: deleteId })
                    .then()

                    res.status(200).json({
                        state: true
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false
            });
        });;
});

//paper edit by paperId
router.patch('/:paperId', (req, res, next) => {
    const patchId = req.params.paperId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Paper
        .update({ _id: patchId }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                state: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                state: false
            });
        });
});

//pass clzId to get its papers
router.get('/getPapersForClass/:clzId', (req, res, next) => {
    const clzId = req.params.clzId;
    Paper
        .find({ clz: clzId })
        .populate('clz', `subjectName`)
        .exec()
        .then(papers => {
            res.status(200).json({
                Paper: papers
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

/*special route for delete all users in database
this is use for developing perposes
Super admins only*/
router.delete('/special/deleteAllPapers', (req, res, next) => {
    Paper
        .find()
        .then(papers => {
            if(!papers){
                res.status(200).json({
                    state: false
                })
            } else{
                Paper
                    .remove()
                    .then()
                res.status(200).json({
                    state: true
                })
            }
        })
})

//get classes of paper marker
router.get('/getClzByPaperMarker/:userId', (req, res, next) => {
    console.log("special route")
    const paperMarkerId = req.params.userId;
    console.log(paperMarkerId)
    Paper
        .find({ paperMarker: paperMarkerId })
        .populate('clz', `clzNo`)
        .exec()
        .then(clz => {
            console.log(clz)
            res.status(200).json({
                state: true,
                Clz: clz
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

module.exports = router;