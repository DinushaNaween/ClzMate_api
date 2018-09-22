const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Paper = require('../models/paper');
const Clz = require('../models/clz');

router.get('/', (req, res, next) => {
    Paper.find()
        .select('clz quantity paperId')
        .populate('clz', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                papers: docs.map(doc => {
                    return {
                        paperId: doc.paperId,
                        clz: doc.clz,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'https://localhost:3000/papers/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Clz.findById(req.body.clzId)
        .then(clz => {
            if (!clz) {
                return res.status(404).json({
                    message: 'Class not found'
                });
            }
            const paper = new Paper({
                paperId: new mongoose.Types.ObjectId(),
                clz: req.body.clzId,
                quantity: req.body.quantity
            });
            return paper
                .save()

        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Paper Stored',
                createdPaper: {
                    paperId: result.paperId,
                    clz: result.clz,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/papers/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'clz not found.',
            });
        })
});

router.get('/:paperId', (req, res, next) => {
    const searchId = req.body.paperId;
    Paper.findById(searchId)
        .populate('clz')
        .exec()
        .then(order => {
            if (!paper) {
                return res.status(404).json({
                    message: "Paper Not Found."
                });
            }
            res.status(200).json({
                paper: paper,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/papers'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                erreo: err
            })
        })
});

router.delete('/:paperId', (req, res, next) => {
    const deleteId = req.body.paperId;
    Paper.remove({ paperId: deleteId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Paper Deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/papers",
                    body: { clzId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });;
});

module.exports = router;