const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userController = require('../controllers/userController');
const clzController = require('../controllers/clzController');

const Attendance = require('../models/attendance');

router.post('/markAttendance', userController.findStudentById, clzController.findClzById, (req, res, next) => {
    console.log('controllers OK');
});

module.exports = router;