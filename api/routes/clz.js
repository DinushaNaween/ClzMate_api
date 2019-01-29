const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Clz = require('../models/clz');
const clzController = require('../controllers/clzController');

//get all clz details
router.get('/', (req, res, next) => {
    Clz
        .find()
        .populate('teacher.contactDetails')
        .exec() 
        .then(docs => {
            console.log(docs); 
            res.status(200).json({
                Clz: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                error: err
            });
        });
});

//create a new clz
router.post('/', (req, res, next) => {
    clzController.count(function(count){
        const clz = new Clz({
            _id: new mongoose.Types.ObjectId(),
            clzNo: count,
            subjectName: req.body.subjectName,
            hallNo: req.body.hallNo,
            grade: req.body.grade,
            day: req.body.day,
            batch: req.body.batch,
            stream: req.body.stream,
            time: req.body.time,
            teacher: req.body.teacher,
            cardMarker: req.body.cardMarker
        });
        clz
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    state: true,
                    clzId: clz._id,
                    teacher: req.body.teacher,
                    Card_Marker: req.body.cardMarker,
                    ClzNo:count
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
});

//get clz details by Id
router.get('/:clzId', clzController.findClzIfExist, (req, res, next) => {
    const searchId = req.params.clzId;
    Clz
        .findById(searchId)
        .populate('teacher cardMarker')
        .exec()
        .then(result => {
            res.status(200).json({
                Clz: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ 
                state: false 
            });
        });

});
 
//edit clz by Id
router.patch('/:clzId', clzController.findClzIfExist, (req, res, next) => {
    const patchId = req.params.clzId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Clz
        .update({ _id: patchId }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                state: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                state: false
            });
        });
});

//delete clz by Id
router.delete('/:clzId', (req, res, next) => {
    const deleteId = req.params.clzId;
    Clz
        .findById(deleteId)
        .then(result => {
            if (result){
                Clz
                    .remove({ _id: deleteId })
                    .then()

                    res.status(200).json({
                        state: true
                    });
            } else {
                res.status(200).json({
                    state: false
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                state: false
            });
        });
});

//get clzes by subject name
router.get('/searchBySubject/:searchValue', (req, res, next) => {
    searchKey = req.params.searchKey;
    searchValue = req.params.searchValue;
    Clz
        .find({ subjectName: searchValue })
        .then(result => {
            console.log(result);
            res.status(200).json({
                state: true,
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

//delete all classes route is for special uses, only for useing development purpose.
router.delete('/specialRoute/deleteAllClasses', (req, res, next) => {
    Clz
        .find()
        .exec()
        .then(result => {
            if(!result){
                res.status(200).json({
                    state: false
                })
            } else {
                Clz
                    .remove()
                    .then()
                    res.status(200).json({
                        state: true
                    })
            }
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        })
})

module.exports = router;