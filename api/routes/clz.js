const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Clz = require('../models/clz');
const User = require('../models/user');

const checkAuth = require('../middlewares/check-auth');

//get all clz details
router.get('/', (req, res, next) => {
    Clz
        .find()
        .exec() 
        .then(docs => {
            console.log(docs); 
            res.status(200).json(
                docs.length,
                docs
            );
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
    const clz = new Clz({
        _id: new mongoose.Types.ObjectId(),
        subjectName: req.body.name,
        hallNo: req.body.hallNo,
        grade: req.body.grade,
        day: req.body.day,
        batch: req.body.batch,
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
                Card_Marker: req.body.cardMarker
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//get clz details by Id
router.get('/:clzId', (req, res, next) => {
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

router.get('/getClzByStudent/:studentId', (req, res, next) => {
    const studentId = req.params.studentId;
    User
        .find({ _id: studentId })
        .exec()
        .then(result => {
            console.log("OK")
        })
        .catch(err => {
            console.log("NOT OK")
        })
})
 
//edit clz by Id
router.patch('/:clzId', (req, res, next) => {
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

//search clz by cardmarker id
router.get('/getClzByCardMarkerId/:cardMarkerId', (req, res, next) => {
    const cardMarker = req.params.cardMarkerId;
    console.log(cardMarker)
    User
        .find({ _id: cardMarker })
        .then(result => {
            console.log(result)
            res.status(200).json({
                state: true
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

module.exports = router;