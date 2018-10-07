const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const clzController = require('../controllers/clzController');

const Attendance = require('../models/attendance');

router.get('/weekAttendance', (req, res, next) => {
    Attendance
        .find()
        .exec()
        .then(result => {
            res.status(200).json({
                Attendance: result
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
});

//create new attendance tuple for new week
router.post('/newWeekAttendance', clzController.findClzById, (req, res, next) => {
    const attendance = new Attendance({
        _id: new mongoose.Types.ObjectId(),
        clz: req.body.clz,
        cardMarker: req.body.cardMarker
    });
    attendance
        .save()
        .then(attendance => {
            console.log(attendance)
            res.status(200).json({
                state: true,
                date: attendance.day.toDateString(),
                attendance
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                state: false
            })
        });
});

//add attendance for a week in existing table
router.patch('/addAttendance/:attendanceId', userController.findStudentById, (req, res, next) => {
    const attendanceId = req.params.attendanceId
    const newStudent = req.body.student;
    Attendance
        .findById(attendanceId)
        .then(attendance => {
            if(!attendance){
                res.status(500).json({
                    state: false
                })
            } else {
                console.log(newStudent)
                attendance.student
                    .push(newStudent)
                attendance
                    .save()
                    .then(result => {
                        console.log(result)
                    })
                    res.status(200).json({
                        state: true
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                err
            })
        })
});

module.exports = router;