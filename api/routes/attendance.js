const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const clzController = require('../controllers/clzController');

const Attendance = require('../models/attendance');

router.post('/newMonthAttendance', userController.findStudentById, clzController.findClzById, (req, res, next) => {
    const attendance = new Attendance({
        _id: new mongoose.Types.ObjectId(),
        clz: req.body.clz,
        student: req.body.student,
        cardMarker: req.body.cardMarker
    });
    attendance
        .save()
        .then(attendance => {
            console.log(attendance)
            res.status(200).json({
                state: true,
                date: attendance.time.toDateString(),
                attendance
            })
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        });
});

// router.post('/addAttendance', userController.findStudentById, clzController.findClzById, (req, res, next) => {
//     const 
// });

module.exports = router;