const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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

router.post('/', (req, res, next)=>{
    res.status(201).json({
        message: 'POST'
    })
})

router.get('/:classId', (req, res, next) => {
    const id = req.params.classId;
    if (id === 'special'){
        res.status(200).json({
            message: 'special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Not Special'
        });
    }
});

router.patch('/:classId', (req, res, next)=>{
    res.status(200).json({
        message: 'PATCH'
    });
});

router.delete('/:classId', (req, res, next)=>{
    res.status(200).json({
        message: 'DELETE'
    });
});

module.exports = router;