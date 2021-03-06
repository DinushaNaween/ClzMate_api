const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const clzController = require('../controllers/clzController');
const attendanceController = require('../controllers/attendanceController');

const Attendance = require('../models/attendance');
const Clz = require('../models/clz');

// get all attendance 
router.get('/allAttendance', (req, res, next) => {
    Attendance
        .find()
        .exec()
        .then(result => {
            console.log(result[0].date.getFullYear())
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
    console.log(req.body);
    const date = req.body.date;
    const attendance = new Attendance({
        _id: new mongoose.Types.ObjectId(),
        clz: req.body.clz,
        cardMarker: req.body.cardMarker,
        date: date,
        year: date.split("-")[0],
        month: date.split("-")[1]
    });
    attendance
        .save()
        .then(attendance => {
            console.log(attendance)
            res.status(200).json({   
                state: true,
                Id: attendance._id,
                date: attendance.date.toDateString(),
                clz: attendance.clz,
                cardMarker: attendance.cardMarker,
                year: attendance.year,
                month: attendance.month
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                Error: err,
                state: false,
                Message: "Not valid date" 
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
                userController.findStudentById
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

//get attendance by day
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

//get attendanse by id
router.get('/:attendanceId', (req, res, next) => {
    const attendanceId = req.params.attendanceId;
    Attendance
        .findById(attendanceId)
        .exec()
        .then(attendance => {
            res.status(200).json({
                attendance
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
});

//get student attendance by studentId
router.get('/studentAttendance/:studentId', (req, res, next) => {
    if(req.params.studentId == null){
        res.status(400).json({
            state: false,
            Message: 'studentId missing'
        })
    }
    const student = req.params.studentId;
    console.log(req.params.studentId)
    Attendance
        .find({ student: student })
        .populate('clz cardMarker student', `indexNo clzNo`)
        .exec()
        .then(result => {
            const length = result.length;
            console.log(result.length);
            const dateIs = result[0].date.toISOString().substring(0, 10);
            console.log(dateIs)
            const attendedDates = [{ date: Date, clz: mongoose.Schema.ObjectId}];
            for (i=0 ; i<length ; i++ ){
                attendedDates[i] = result[i].date.toISOString().substring(0, 10);
            }
            res.status(200).json({
                // date: result[0].date
                attendedDates
                // Attendances: result
            })
        })
        .catch(err => {
            console.log(err);
        })
}); 

//get attendance by clzId, year, month 
router.get('/attendanceForClzId/:year/:month/:clzId', clzController.findClzIfExist, (req, res, next) => {
    const reqMonth = attendanceController.stringToNumber(req.params.month)
    const reqYear = req.params.year;
    const clzId = req.params.clzId;
    if(reqMonth == 0){
        Attendance
        .find(
            { $and: [ { clz: clzId }, { year: reqYear } ] }
        )
        .populate('student clz cardMarker', `indexNo clzNo fullName`)
        .sort({ month: 1 })
        .exec()
        .then(attendanceList => {
            console.log(attendanceList);
            res.status(200).json({
                Attendance: attendanceList
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
    } else{
        Attendance
        .find({
            $and: [ { clz: clzId }, { year: reqYear }, { month: reqMonth } ]
        })
        .populate('student clz cardMarker', `indexNo clzNo fullName`)
        .exec()
        .then(attendanceList => {
            console.log(attendanceList);
            res.status(200).json({
                Attendance: attendanceList
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
    }
})

module.exports = router; 