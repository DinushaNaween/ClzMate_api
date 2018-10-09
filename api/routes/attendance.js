const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const clzController = require('../controllers/clzController');

const Attendance = require('../models/attendance');

// get all attendance 
router.get('/allAttendance', (req, res, next) => {
    Attendance
        .find()
        .exec()
        .then(result => {
            console.log(result.day)
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
        cardMarker: req.body.cardMarker,
        date: req.body.date
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

//get attendance by week
router.get('/weekAttendance/:day', (req, res, next) => {
    const week = req.params.day;
    Attendance
        .find({ date: week })
        .exec()
        .then(attendance => {
            const month = attendance[0].date.toDateString()
            console.log(month)
            console.log(attendance)
            res.status(200).json({
                attendance
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
});

router.get('/:attendanceId', (req, res, next) => {
    const attendanceId = req.params.attendanceId;
    console.log(attendanceId)
    Attendance
        .findById(attendanceId)
        .exec()
        // .then(result => {
            


        //     // const length = result.student.length
        //     // const students = result.student[0]
        //     // console.log(length-1)
        //     // console.log(students)
        //     // // console.log(result)
        //     // res.status(200).json({
        //     //     result
        //     // })
        // })
        .then(result => {
            for(const item in result.student){
                console.log(item.valueOf());
            }
        })
});

router.get('/studentAttendance/:studentId', (req, res, next) => {
    const student = req.params.studentId;
    console.log(req.params.studentId)
    Attendance
        .find({'attendance.student': { $elemMatch: { id: student }}}, function(err, attendance){
            if (err){
                return (err)
            }
            if (attendance){
                console.log('one')
                res.status(200).json({
                    attendance
                })
            } else{
                console.log('second')
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({
                result
            })
        })
}); 

module.exports = router;

