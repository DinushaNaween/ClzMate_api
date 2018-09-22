const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Clz = require('../models/clz');

router.get('/', (req, res, next) => {
    Clz.find()
        .select('name price clzId')
        .exec() 
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                clzes: docs.map(doc => {
                    return {
                        name: doc.name,
                        hallNo: doc.hallNo,
                        clzId: doc.clzId,
                        request: {
                            type: 'get',
                            url: 'http://localhost:3000/clzes/' + doc._id
                        }
                    }
                })
            } 
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const clz = new Clz({
        clzId: new mongoose.Types.ObjectId(),
        name: req.body.name,
        hallNo: req.body.hallNo
    });
    clz
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /classes',
                createdlz: {
                    name: result.name,
                    hallNo: result.hallNo,
                    clzId: result.clzId,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/clzes/' + result._id
                    }
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

router.get('/:clzId', (req, res, next) => {
    const searchId = req.params.clzId;
    Clz.findById(searchId)
        .select('name price clzId')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    clz: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all classes details.',
                        url: 'http://localhost:3000/clzes'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for this clzId'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});
 
router.patch('/:clzId', (req, res, next) => {
    const patchId = req.params.clzId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Clz.update({ clzId: patchId }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Class Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/clzes/' + id
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

router.delete('/:clzId', (req, res, next) => {
    const deleteId = req.params.clzId;
    Clz.remove({ clzId: deleteId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Class Deleted.',
                request: {
                    type: 'POST',
                    url: 'https://localhost:3000/clzes',
                    body: { name: 'String', price: 'Number' }
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

module.exports = router;