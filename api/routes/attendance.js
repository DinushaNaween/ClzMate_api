const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const clzController = require('../controllers/clzController');

const Attendance = require('../models/attendance');

router.post('/newMonthAttendance', userController.findStudentById, clzController.findClzById, (req, res, next) => {
    const attendance = new Attendance({
        _id: new mongoose.Types.ObjectId(),
        attendance: req.body.attendance,
        clz: req.body.clz,
        student: req.body.student,
        cardMarker: req.body.cardMarker
    });
    console.log(attendance)
    attendance
        .save()
        .then(attendance => {
            res.status(200).json({
                state: true,
                attendance
            })
        })
        .catch(err => {
            res.status(200).json({
                state: false
            })
        });
});

router.post('/addAttendance', )

module.exports = router;