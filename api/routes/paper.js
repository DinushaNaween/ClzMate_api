const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Paper = require('../models/paper');
const Clz = require('../models/clz');

//get all papers details
router.get('/', (req, res, next) => {
    Paper
        .find()
        .populate('clz')
        .exec()
        .then(result => {
            res.status(200).json(
                result
            );
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//create a paper
router.post('/', (req, res, next) => {
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
                clz: req.body.clzId
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

module.exports = router;