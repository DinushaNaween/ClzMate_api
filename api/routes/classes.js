const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

//const upload = multer({ storage: storage })
const upload = multer({storage: storage});

const Class = require('../models/class');

router.get('/', (req, res, next) => {
    Class.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                classes: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'get',
                            url: 'http://localhost:3000/classes/' + doc._id
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

router.post('/', upload.single('classImage'), (req, res, next) => {
    const newclass = new Class({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    newclass
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /classes',
                createdClass: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/classes/' + result._id
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

router.get('/:classId', (req, res, next) => {
    const id = req.params.classId;
    Class.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    class: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all class details.',
                        url: 'http://localhost:3000/classes'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for this classId'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});


router.patch('/:classId', (req, res, next) => {
    const id = req.params.classId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Class.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Class Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/classes/' + id
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

router.delete('/:classId', (req, res, next) => {
    const id = req.params.classId;
    Class.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Class Deleted.',
                request: {
                    type: 'POST',
                    url: 'https://localhost:3000/classes',
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